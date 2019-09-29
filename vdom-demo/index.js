render();

function View() {
  return (
    <div>
      xxx
      <ul className="children">
        <li id="1">1</li>
        <li id="2">2</li>
        <li id="3">3</li>
      </ul>
    </div>
  )
}

function setProps(element, props) {
  for (item in props) {
    element.setAttribute(item, props[item]);
  }
}

function createElement(vdom) {
  if (typeof vdom === 'string' || typeof vdom === 'number') {
    return document.createTextNode(vdom);
  }

  const element = document.createElement(vdom.tag);
  setProps(element, vdom.props);
  vdom.children.map(createElement).forEach(element.appendChild.bind(null));
  return element;
}

function render() {
  const vdom = View();
  console.log(vdom);
  const nodeElemnt = createElement(vdom);
  document.getElementById('root').appendChild(nodeElemnt);
}

// jsx编译时使用，方法名在plugin-transform-react-jsx中定义
function dom(tag, props, ...children) {
  return {
    tag: tag,
    props: props || [],
    children
  }
}
