import { parseFragment, type DefaultTreeAdapterTypes } from 'parse5'
import {
  computed,
  h,
  type VNode,
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

// HTML要素の属性型マッピング
type ElementAttributesMap = {
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

  // 一般的なHTML要素（特定の属性型がないもの）
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

// カスタムコンポーネントの props の型定義（ジェネリック型を使用）
export interface CustomComponentProps {
  children?: VNode[]
}

// カスタムコンポーネントの型定義（特定のHTML要素の属性型を受け取る）
export type CustomComponent<T extends keyof ElementAttributesMap = keyof ElementAttributesMap>
  = Component
    | ((props: ElementAttributesMap[T] & CustomComponentProps) => VNode)

// カスタムコンポーネントのマップの型定義（型推論を向上）
export type CustomComponents = {
  [K in keyof ElementAttributesMap]?: (props: ElementAttributesMap[K] & CustomComponentProps) => VNode
} & {
  [tagName: string]: (props: HTMLAttributes & CustomComponentProps) => VNode
}

export function useHtml(html: string, customComponents?: CustomComponents) {
  const documentFragment = parseFragment(html)

  const isElement = (node: DefaultTreeAdapterTypes.ChildNode): node is DefaultTreeAdapterTypes.Element => {
    return node.nodeName !== '#text' && node.nodeName !== '#comment'
  }

  const isTextNode = (node: DefaultTreeAdapterTypes.ChildNode): node is DefaultTreeAdapterTypes.TextNode => {
    return node.nodeName === '#text'
  }

  const getTextValue = (node: DefaultTreeAdapterTypes.TextNode): string => {
    return node.value
  }

  const renderNode = (node: DefaultTreeAdapterTypes.ChildNode): VNode | null => {
    if (isTextNode(node)) {
      const text = getTextValue(node).trim()
      if (text === '') {
        return null
      }
      // テキストノードもVNodeとして返す
      return h('span', text)
    }

    if (!isElement(node)) {
      return null // コメントノードなどはnullを返す
    }

    const element = node as DefaultTreeAdapterTypes.Element
    const tagName = element.tagName

    // 属性を取得
    const attrs: Record<string, string | number | boolean> = {}
    if (element.attrs) {
      element.attrs.forEach((attr) => {
        attrs[attr.name] = attr.value
      })
    }

    // 子要素を再帰的にレンダリング
    const children: VNode[] = []
    if (element.childNodes) {
      element.childNodes.forEach((child) => {
        const renderedChild = renderNode(child)
        if (renderedChild !== null) {
          children.push(renderedChild)
        }
      })
    }

    // カスタムコンポーネントが定義されている場合はそれを使用
    const customComponent = customComponents?.[tagName]
    if (customComponent) {
      const props: CustomComponentProps = {
        ...attrs,
        children: children.length > 0 ? children : undefined,
      }

      // カスタムコンポーネントが関数の場合は実行、そうでなければh()で処理
      if (typeof customComponent === 'function' && !('render' in customComponent)) {
        return (customComponent as (props: CustomComponentProps) => VNode)(props)
      }
      else {
        return h(customComponent as Component, attrs, children)
      }
    }

    return h(tagName, attrs, children)
  }

  // 全てのノードを事前にレンダリングし、Fragmentで包む
  const renderedContent = computed(() => {
    const nodes = documentFragment.childNodes
      .map(node => renderNode(node))
      .filter((node): node is VNode => node !== null)

    if (nodes.length === 0) {
      return null
    }

    if (nodes.length === 1) {
      return nodes[0]
    }

    return h(Fragment, {}, nodes)
  })

  return {
    renderedContent,
  }
}
