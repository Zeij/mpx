import path from 'path'
import slash from 'slash'
import { Query } from '../../types/query'
import compiler, { SFCDescriptor } from '../../types/compiler'
import pathHash from '../../utils/pageHash'
import { ResolvedOptions } from '../../options'
const cache = new Map<string, SFCDescriptor>()
const prevCache = new Map<string, SFCDescriptor | undefined>()

function genDescriptorTemplate() {
  const template: SFCDescriptor['template'] = {
    tag: 'template',
    type: 'template',
    content: '<div class="app"><mpx-keep-alive><router-view class="page"></router-view></mpx-keep-alive></div>',
    attrs: {},
    start: 0,
    end: 0
  }
  return template
}

function genDescriptorScript(descriptor: SFCDescriptor) {
  const script: SFCDescriptor['script'] = {
    tag: 'script',
    type: 'script',
    content: '',
    attrs: {},
    start: 0,
    end: 0
  }
  if (descriptor.app) {
    script.content = `
import { createApp } from "@mpxjs/core"
createApp({})`
  }
  if (descriptor.isPage) {
    script.content = `
import { createPage } from "@mpxjs/core"
createPage({})`
  }
  if (descriptor.isComponent) {
    script.content = `
import { createComponent } from "@mpxjs/core"
createComponent({})`
  }
  return script
}

export function createDescriptor(
  filename: string,
  code: string,
  query: Query,
  options: ResolvedOptions
): SFCDescriptor {
  const { projectRoot = '', isProduction, mode = 'web', defs, env, sourceMap } = options
  const descriptor = compiler.parseComponent(code, {
    mode,
    defs,
    env,
    filePath: filename,
    pad: 'line',
    needMap: sourceMap
  })
  const normalizedPath = slash(
    path.normalize(path.relative(projectRoot, filename))
  )
  descriptor.id = pathHash(normalizedPath + (isProduction ? code : ''))
  descriptor.filename = filename
  descriptor.isPage = query.isPage !== undefined
  descriptor.isComponent = query.isComponent !== undefined
  descriptor.app = !(descriptor.isPage || descriptor.isComponent)
  if (descriptor.app) {
    descriptor.template = genDescriptorTemplate()
  }
  if (!descriptor.script) {
    descriptor.script = genDescriptorScript(descriptor)
  }
  cache.set(filename, descriptor)
  return descriptor
}

export function getPrevDescriptor(filename: string): SFCDescriptor | undefined {
  return prevCache.get(filename)
}

export function setPrevDescriptor(
  filename: string,
  entry: SFCDescriptor
): void {
  prevCache.set(filename, entry)
}

export function getDescriptor(
  filename: string,
  code?: string,
  query?: Query,
  options?: ResolvedOptions,
  createIfNotFound = true
): SFCDescriptor | undefined {
  if (cache.has(filename)) {
    return cache.get(filename)
  }
  if (createIfNotFound && code && query && options) {
    return createDescriptor(filename, code, query, options)
  }
}

export function setDescriptor(filename: string, entry: SFCDescriptor): void {
  cache.set(filename, entry)
}
