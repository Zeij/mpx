import fs from 'fs'
import json5 from 'json5'
import path from 'path'
import { TransformPluginContext } from 'rollup'
import { normalizePath } from 'vite'
import { ResolvedOptions } from '../../options'
import { proxyPluginContext } from '../../pluginContextProxy'
import addQuery from '@mpxjs/compile-utils/add-query'
import getJSONContent from '../../utils/get-json-content'
import parseRequest from '@mpxjs/compile-utils/parse-request'
import resolveModuleContext from '../../utils/resolveModuleContext'
import stringify from '../../utils/stringify'
import { SFCDescriptor } from '../compiler'
import mpxGlobal from '../mpx'
import { createDescriptor } from '../utils/descriptorCache'
import pathHash from '../utils/pageHash'

/**
 * wechat miniprogram app/page/component config type
 */
export interface JsonConfig {
  component?: boolean
  usingComponents?: Record<string, string>
  componentGenerics?: Record<string, { default?: string }>
  packages?: string[]
  pages?: (
    | string
    | {
        src: string
        path: string
      }
  )[]
  tabBar?: {
    custom?: boolean
    color?: string
    selectedColor?: string
    backgroundColor?: string
    list?: {
      pagePath: string
      text: string
    }[]
  }
  networkTimeout?: {
    request: number
    connectSocket: number
    uploadFile: number
    downloadFile: number
  }
  subpackages: {
    root?: 'string'
    pages: JsonConfig['pages']
  }[]
  window?: Record<string, unknown>
  style?: string
  singlePage?: {
    navigationBarFit: boolean
  }
}

/**
 * resolve json content
 * @param descriptor - SFCDescriptor
 * @param options - ResolvedOptions
 * @param pluginContext - TransformPluginContext
 * @returns json config
 */
export async function resolveJson(
  descriptor: SFCDescriptor,
  options: ResolvedOptions,
  pluginContext: TransformPluginContext
): Promise<JsonConfig> {
  const { defs } = options
  const { json } = descriptor
  let content = json?.content || '{}'
  if (json) {
    content = await getJSONContent(
      json,
      descriptor.filename,
      proxyPluginContext(pluginContext),
      defs,
      fs
    )
  }
  return json5.parse(content)
}

/**
 * dep entry/packages/sub-packages to collect pages/components/tabbar
 * @param descriptor - SFCDescriptor
 * @param options - ResolvedOptions
 * @param pluginContext - TransformPluginContext
 */
export async function processJSON(
  descriptor: SFCDescriptor,
  options: ResolvedOptions,
  pluginContext: TransformPluginContext
): Promise<void> {
  const jsonConfig = (descriptor.jsonConfig = await resolveJson(
    descriptor,
    options,
    pluginContext
  ))
  const { filename } = descriptor
  const pagesMap: SFCDescriptor['pagesMap'] = {}
  const componentsMap: SFCDescriptor['componentsMap'] = {}

  let tabBarMap: Record<string, unknown> = {}
  let tabBarStr = ''

  const defaultTabbar = {
    borderStyle: 'black',
    position: 'bottom',
    custom: false,
    isShow: true
  }

  function emitWarning(msg: string) {
    pluginContext.warn('[json processor]: ' + msg)
  }

  /**
   * ./page/index/index.mpx = page/index/index
   * @param page - pagePath
   */
  function genPageRoute(page: string, context: string, root = '') {
    const relative = path.relative(context, page)
    return normalizePath(
      path.join(root, /^(.*?)(\.[^.]*)?$/.exec(relative)?.[1] || '')
    )
  }

  const processTabBar = async (tabBar: JsonConfig['tabBar']) => {
    if (tabBar) {
      tabBar = { ...defaultTabbar, ...tabBar }
      tabBarMap = {}
      jsonConfig?.tabBar?.list?.forEach(({ pagePath }) => {
        tabBarMap[pagePath] = true
      })
      tabBarStr = stringify(tabBar)
      tabBarStr = tabBarStr.replace(
        /"(iconPath|selectedIconPath)":"([^"]+)"/g,
        function (matched) {
          return matched
        }
      )
    }
  }

  const processPages = async (
    pages: JsonConfig['pages'] = [],
    importer: string,
    root = '.'
  ) => {
    const context = resolveModuleContext(importer)
    for (const page of pages) {
      const customPage = !(typeof page === 'string')
      const pageSrc = !customPage ? page : page.src
      const pageModule = await pluginContext.resolve(
        addQuery(path.resolve(context, root, pageSrc), {
          page: true
        }),
        path.join(context, root)
      )
      if (pageModule) {
        const pageId = pageModule.id
        const { resourcePath: pageFileName } = parseRequest(pageModule.id)
        const pageRoute = !customPage
          ? genPageRoute(pageFileName, context)
          : page.path
        if (pagesMap[pageRoute]) {
          emitWarning(
            `Current page [${pageSrc}] which is imported from [${importer}] has been registered in pagesMap already, it will be ignored, please check it and remove the redundant page declaration!`
          )
          return
        }
        // record page route for resolve
        mpxGlobal.pagesMap[pageFileName] = pageRoute
        mpxGlobal.pagesEntryMap[pageFileName] = importer
        // resolved page
        pagesMap[pageRoute] = pageId
      } else {
        emitWarning(
          `Current page [${pageSrc}] is not in current pages directory [${context}]`
        )
      }
    }
  }

  const processComponent = async (
    componentName: string,
    componentPath: string,
    importer: string
  ) => {
    if (componentPath) {
      const componetModule = await pluginContext.resolve(
        addQuery(componentPath, { component: true }),
        importer
      )
      if (componetModule) {
        const componentId = componetModule.id
        const { resourcePath: componentFileName } = parseRequest(componentId)
        mpxGlobal.componentsMap[componentFileName] =
          componentFileName + pathHash(componentFileName)
        componentsMap[componentName] = componentId
      }
    }
  }

  const processComponents = async (
    components: JsonConfig['usingComponents'],
    importer: string
  ) => {
    for (const key in components) {
      await processComponent(key, components[key], importer)
    }
  }

  const processGenerics = async (
    generics: JsonConfig['componentGenerics'] = {},
    importer: string
  ) => {
    for (const key in generics) {
      const generic = generics[key]
      if (generic.default) {
        await processComponent(`${key}default`, generic.default, importer)
      }
    }
  }

  const processPackages = async (
    packages: JsonConfig['packages'] = [],
    context: string
  ) => {
    for (const packagePath of packages) {
      const { resourcePath: filename, queryObj: query } = parseRequest(packagePath)
      const packageModule = await pluginContext.resolve(filename, context)
      if (packageModule) {
        const packageId = packageModule.id
        pluginContext.addWatchFile(packageId)
        const code = await fs.promises.readFile(packageId, 'utf-8')
        const descriptor = createDescriptor(packageId, code, query, options)
        const { pages, packages } = (descriptor.jsonConfig = await resolveJson(
          descriptor,
          options,
          pluginContext
        ))
        await processPages(pages, packageId, query.root)
        await processPackages(packages, packageId)
      }
    }
  }

  const processSubPackages = async (
    subPackages: JsonConfig['subpackages'] = [],
    context: string
  ) => {
    for (const subPackage of subPackages) {
      await processPages(subPackage.pages, context, subPackage.root)
    }
  }

  try {
    Promise.all([
      processPages(jsonConfig.pages, filename),
      processPackages(jsonConfig.packages, filename),
      processSubPackages(jsonConfig.subpackages, filename),
      processComponents(jsonConfig.usingComponents, filename),
      processGenerics(jsonConfig.componentGenerics, filename),
      processTabBar(jsonConfig.tabBar)
    ]).then(() => {
      descriptor.pagesMap = pagesMap
      descriptor.componentsMap = componentsMap
      descriptor.tabBarMap = tabBarMap
      descriptor.tabBarStr = tabBarStr
    })
  } catch (error) {
    pluginContext.error(`[mpx loader] process json error: ${error}`)
  }
}
