import { parseFragment, type DefaultTreeAdapterTypes } from 'parse5'
import { computed, h, type VNode, Fragment } from 'vue'

export function useHtml(html: string) {
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
      return h('span', { style: { display: 'contents' } }, text)
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
