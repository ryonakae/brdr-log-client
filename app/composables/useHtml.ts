/**
 * HTML文字列をVueのVNodeにレンダリングするComposable
 *
 * @description parse5を使用してHTMLをパースし、Vue 3のh()関数を使って
 * VNodeツリーに変換する。カスタムコンポーネントを指定することで、
 * 特定のHTML要素をVueコンポーネントとしてレンダリングできる。
 */

import { parseFragment, type DefaultTreeAdapterTypes } from 'parse5'
import {
  computed,
  Fragment,
  type Component,
  type HTMLAttributes,
  type AnchorHTMLAttributes,
  type AreaHTMLAttributes,
  type AudioHTMLAttributes,
  type BaseHTMLAttributes,
  type BlockquoteHTMLAttributes,
  type ButtonHTMLAttributes,
  type CanvasHTMLAttributes,
  type ColHTMLAttributes,
  type ColgroupHTMLAttributes,
  type DataHTMLAttributes,
  type DelHTMLAttributes,
  type DetailsHTMLAttributes,
  type DialogHTMLAttributes,
  type EmbedHTMLAttributes,
  type FieldsetHTMLAttributes,
  type FormHTMLAttributes,
  type HtmlHTMLAttributes,
  type IframeHTMLAttributes,
  type ImgHTMLAttributes,
  type InputHTMLAttributes,
  type InsHTMLAttributes,
  type KeygenHTMLAttributes,
  type LabelHTMLAttributes,
  type LiHTMLAttributes,
  type LinkHTMLAttributes,
  type MapHTMLAttributes,
  type MenuHTMLAttributes,
  type MetaHTMLAttributes,
  type MeterHTMLAttributes,
  type ObjectHTMLAttributes,
  type OlHTMLAttributes,
  type OptgroupHTMLAttributes,
  type OptionHTMLAttributes,
  type OutputHTMLAttributes,
  type ParamHTMLAttributes,
  type ProgressHTMLAttributes,
  type QuoteHTMLAttributes,
  type ScriptHTMLAttributes,
  type SelectHTMLAttributes,
  type SourceHTMLAttributes,
  type StyleHTMLAttributes,
  type TableHTMLAttributes,
  type TdHTMLAttributes,
  type TextareaHTMLAttributes,
  type ThHTMLAttributes,
  type TimeHTMLAttributes,
  type TrackHTMLAttributes,
  type VideoHTMLAttributes,
  type WebViewHTMLAttributes,
} from 'vue'

/**
 * HTML要素とそれに対応するVueの属性型のマッピング
 */
type ElementAttributesMap = {
  // 特定の属性型を持つHTML要素
  a: AnchorHTMLAttributes
  area: AreaHTMLAttributes
  audio: AudioHTMLAttributes
  base: BaseHTMLAttributes
  blockquote: BlockquoteHTMLAttributes
  button: ButtonHTMLAttributes
  canvas: CanvasHTMLAttributes
  col: ColHTMLAttributes
  colgroup: ColgroupHTMLAttributes
  data: DataHTMLAttributes
  del: DelHTMLAttributes
  details: DetailsHTMLAttributes
  dialog: DialogHTMLAttributes
  embed: EmbedHTMLAttributes
  fieldset: FieldsetHTMLAttributes
  form: FormHTMLAttributes
  html: HtmlHTMLAttributes
  iframe: IframeHTMLAttributes
  img: ImgHTMLAttributes
  input: InputHTMLAttributes
  ins: InsHTMLAttributes
  keygen: KeygenHTMLAttributes
  label: LabelHTMLAttributes
  li: LiHTMLAttributes
  link: LinkHTMLAttributes
  map: MapHTMLAttributes
  menu: MenuHTMLAttributes
  meta: MetaHTMLAttributes
  meter: MeterHTMLAttributes
  object: ObjectHTMLAttributes
  ol: OlHTMLAttributes
  optgroup: OptgroupHTMLAttributes
  option: OptionHTMLAttributes
  output: OutputHTMLAttributes
  param: ParamHTMLAttributes
  progress: ProgressHTMLAttributes
  q: QuoteHTMLAttributes
  script: ScriptHTMLAttributes
  select: SelectHTMLAttributes
  source: SourceHTMLAttributes
  style: StyleHTMLAttributes
  table: TableHTMLAttributes
  td: TdHTMLAttributes
  textarea: TextareaHTMLAttributes
  th: ThHTMLAttributes
  time: TimeHTMLAttributes
  track: TrackHTMLAttributes
  video: VideoHTMLAttributes
  webview: WebViewHTMLAttributes

  // 一般的なHTMLAttributes型を使用するHTML要素
  div: HTMLAttributes
  span: HTMLAttributes
  p: HTMLAttributes
  h1: HTMLAttributes
  h2: HTMLAttributes
  h3: HTMLAttributes
  h4: HTMLAttributes
  h5: HTMLAttributes
  h6: HTMLAttributes
  ul: HTMLAttributes
  thead: HTMLAttributes
  tbody: HTMLAttributes
  tfoot: HTMLAttributes
  tr: HTMLAttributes
  pre: HTMLAttributes
  code: HTMLAttributes
  strong: HTMLAttributes
  em: HTMLAttributes
  br: HTMLAttributes
  hr: HTMLAttributes
  section: HTMLAttributes
  article: HTMLAttributes
  header: HTMLAttributes
  footer: HTMLAttributes
  nav: HTMLAttributes
  aside: HTMLAttributes
  main: HTMLAttributes
  figure: HTMLAttributes
  figcaption: HTMLAttributes
  mark: HTMLAttributes
  small: HTMLAttributes
  sub: HTMLAttributes
  sup: HTMLAttributes
  i: HTMLAttributes
  b: HTMLAttributes
  u: HTMLAttributes
  s: HTMLAttributes
  cite: HTMLAttributes
  abbr: HTMLAttributes
  dfn: HTMLAttributes
  kbd: HTMLAttributes
  samp: HTMLAttributes
  var: HTMLAttributes
  wbr: HTMLAttributes
  dd: HTMLAttributes
  dl: HTMLAttributes
  dt: HTMLAttributes
}

/**
 * カスタムコンポーネントが受け取るpropsの基本型
 */
interface CustomComponentProps {
  /** 子要素のVNodeリスト */
  children?: VNode[]
}

/**
 * カスタムコンポーネントのマップ型定義
 * HTML要素名をキーとして、対応するカスタムコンポーネントを定義
 */
type CustomComponents = {
  [K in keyof ElementAttributesMap]?: (props: ElementAttributesMap[K] & CustomComponentProps) => VNode
} & {
  [tagName: string]: (props: HTMLAttributes & CustomComponentProps) => VNode
}

/**
 * ノードがHTML要素かどうかを判定
 */
function isElementNode(node: DefaultTreeAdapterTypes.ChildNode): node is DefaultTreeAdapterTypes.Element {
  return node.nodeName !== '#text' && node.nodeName !== '#comment'
}

/**
 * ノードがテキストノードかどうかを判定
 */
function isTextNode(node: DefaultTreeAdapterTypes.ChildNode): node is DefaultTreeAdapterTypes.TextNode {
  return node.nodeName === '#text'
}

/**
 * テキストノードからテキスト内容を取得
 */
function getTextContent(node: DefaultTreeAdapterTypes.TextNode): string {
  return node.value
}

/**
 * HTML要素から属性を抽出してオブジェクトとして返す
 */
function extractAttributes(element: DefaultTreeAdapterTypes.Element): Record<string, string | number | boolean> {
  const attrs: Record<string, string | number | boolean> = {}
  if (element.attrs) {
    element.attrs.forEach((attr) => {
      attrs[attr.name] = attr.value
    })
  }
  return attrs
}

/**
 * テキストノードをVNodeにレンダリング
 */
function renderTextNode(node: DefaultTreeAdapterTypes.TextNode): VNode | null {
  const text = getTextContent(node).trim()
  if (text === '') {
    return null
  }
  return h('span', text)
}

/**
 * 子ノードリストを再帰的にレンダリング
 */
function renderChildren(
  childNodes: DefaultTreeAdapterTypes.ChildNode[] | undefined,
  renderNodeFn: (node: DefaultTreeAdapterTypes.ChildNode) => VNode | null,
): VNode[] {
  if (!childNodes) {
    return []
  }

  const children: VNode[] = []
  childNodes.forEach((child) => {
    const renderedChild = renderNodeFn(child)
    if (renderedChild !== null) {
      children.push(renderedChild)
    }
  })
  return children
}

/**
 * カスタムコンポーネントでレンダリング
 */
function renderWithCustomComponent(
  customComponent: (props: CustomComponentProps) => VNode,
  attrs: Record<string, string | number | boolean>,
  children: VNode[],
): VNode {
  const props: CustomComponentProps = {
    ...attrs,
    children: children.length > 0 ? children : undefined,
  }

  // カスタムコンポーネントが関数の場合は実行、そうでなければh()で処理
  if (typeof customComponent === 'function' && !('render' in customComponent)) {
    return customComponent(props)
  }
  else {
    return h(customComponent as Component, attrs, children)
  }
}

/**
 * 標準HTML要素としてレンダリング
 */
function renderStandardElement(
  tagName: string,
  attrs: Record<string, string | number | boolean>,
  children: VNode[],
): VNode {
  return h(tagName, attrs, children)
}

/**
 * HTMLをVNodeにレンダリングするメインのcomposable関数
 */
export function useHtml(html: string, customComponents?: CustomComponents) {
  const documentFragment = parseFragment(html)

  /**
   * ノードを再帰的にVNodeにレンダリング
   */
  const renderNode = (node: DefaultTreeAdapterTypes.ChildNode): VNode | null => {
    // テキストノードの処理
    if (isTextNode(node)) {
      return renderTextNode(node)
    }

    // 要素ノード以外（コメントなど）はスキップ
    if (!isElementNode(node)) {
      return null
    }

    const element = node
    const tagName = element.tagName
    const attrs = extractAttributes(element)
    const children = renderChildren(element.childNodes, renderNode)

    // カスタムコンポーネントが定義されている場合
    const customComponent = customComponents?.[tagName]
    if (customComponent) {
      return renderWithCustomComponent(customComponent, attrs, children)
    }

    // 標準HTML要素としてレンダリング
    return renderStandardElement(tagName, attrs, children)
  }

  /**
   * ドキュメントフラグメント全体をレンダリング
   */
  const renderDocumentFragment = (): VNode | null => {
    const nodes = documentFragment.childNodes
      .map(node => renderNode(node))
      .filter((node): node is VNode => node !== null)

    // nodeが0の場合はnullを返す
    if (nodes.length === 0) {
      return null
    }

    // nodeが1の場合はそのまま返す
    if (nodes.length === 1) {
      return nodes[0]!
    }

    // nodeが2以上の場合はFragmentでラップして返す
    return h(Fragment, {}, nodes)
  }

  const renderedContent = computed(() => renderDocumentFragment())

  return {
    renderedContent,
  }
}
