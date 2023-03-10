'use strict';

const Simptemp = function() {
  this.inflate = function(template, data, container) {
    if ((template == null) || (data == null)) return;

    let inflated = [];
    let isContainer = template.classList.contains('template-container');

    if (!Array.isArray(data)) data = [ data ];
    for (let d of data) {
      let clone = template.cloneNode(true);
      clone.removeAttribute('id');
      clone.classList.remove('template');
      clone.classList.remove('template-container');
      for (let key in d) {
        if (!d.hasOwnProperty(key)) continue;
        this.bindKey(clone, key, d[key]);
      }
      this.event.apply(clone);
      if (isContainer) {
        clone.childNodes.forEach(elm => inflated.push(elm));
      } else {
        inflated.push(clone);
      }
    }

    if (container == null) return inflated;
    for (let elm of inflated) {
      container.appendChild(elm);
    }
  };
  this.inflateAsHtml = function(template, data) {
    let inflated = this.inflate(template, data);
    let html = '';
    for (let elm of inflated) {
      if (elm instanceof Text) {
        html += elm.wholeText;
      } else if (elm instanceof HTMLElement) {
        html += elm.outerHTML;
      }
    }
    return html;
  };

  this.attrNameBind2Text = 'data-simptemp-key2text';
  this.attrNameBind2Html = 'data-simptemp-key2html';
  this.attrNameBind2Attr = 'data-simptemp-key2attr';
  this.attrNameBind2ThisText = 'data-simptemp-key2thistext';
  this.attrNameBind2ThisHtml = 'data-simptemp-key2thishtml';
  this.attrNameApply = 'data-simptemp-apply';

  this.bindTypeDef = { 'text': 0, 'html': 1, 'attr': 2, 'thistext': 3, 'thishtml': 4 };
  this.applyTypeDef = { 'replace': 0, 'prepend': 1, 'append': 2 };

  this.bindKey = function(rootElement, key, value) {
    let selBind2Text = '[' + this.attrNameBind2Text + '=' + key + ']';
    rootElement.querySelectorAll(selBind2Text).forEach((elm) => {
      let textNode = document.createTextNode(value);
      this.applyData(this.bindTypeDef.text, elm, key, textNode);
    });

    let selBind2Html = '[' + this.attrNameBind2Html + '=' + key + ']';
    rootElement.querySelectorAll(selBind2Html).forEach((elm) => {
      let htmlParent = document.createElement('div');
      htmlParent.innerHTML = value;
      let nodes = htmlParent.childNodes;
      this.applyData(this.bindTypeDef.html, elm, key, nodes);
    });

    let selBind2Attr = '[' + this.attrNameBind2Attr + ']';
    rootElement.querySelectorAll(selBind2Attr).forEach((elm) => {
      let attrNameMap = {};
      elm.getAttribute(this.attrNameBind2Attr).split(',').forEach(k => {
        let pair = k.split(':');
        let src = pair[0].trim();
        let dest = (pair.length > 1)? pair[1].trim(): src;
        if (dest === '') dest = src;
        if (src !== '') attrNameMap[src] = dest;
      });
      if (key in attrNameMap) {
        let attrName = attrNameMap[key];
        this.applyData(this.bindTypeDef.attr, elm, attrName, value);
      }
    });

    let selBind2ThisText = '[' + this.attrNameBind2ThisText + '=' + key + ']';
    rootElement.querySelectorAll(selBind2ThisText).forEach((elm) => {
      let textNode = document.createTextNode(value);
      this.applyData(this.bindTypeDef.thistext, elm, key, textNode);
    });
    let nodesThisTextRemove = rootElement.querySelectorAll(selBind2ThisText);
    for (let i = 0; i < nodesThisTextRemove.length; i++) {
      nodesThisTextRemove[i].remove();
    }

    let selBind2ThisHtml = '[' + this.attrNameBind2ThisHtml + '=' + key + ']';
    rootElement.querySelectorAll(selBind2ThisHtml).forEach((elm) => {
      let htmlParent = document.createElement('div');
      htmlParent.innerHTML = value;
      let nodes = htmlParent.childNodes;
      this.applyData(this.bindTypeDef.thishtml, elm, key, nodes);
    });
    let nodesThisHtmlRemove = rootElement.querySelectorAll(selBind2ThisHtml);
    for (let i = 0; i < nodesThisHtmlRemove.length; i++) {
      nodesThisHtmlRemove[i].remove();
    }
  }

  this.applyData = function(bindType, node, key, valueOrNode) {
    let applyType = this.applyTypeDef.replace;
    if (node.hasAttribute(this.attrNameApply)) {
      if (node.getAttribute(this.attrNameApply) === 'prepend') {
        applyType = this.applyTypeDef.prepend;
      } else if (node.getAttribute(this.attrNameApply) === 'append') {
        applyType = this.applyTypeDef.append;
      }
    }
    if ((bindType === this.bindTypeDef.text)
        || (bindType === this.bindTypeDef.html)) {
      this.applyNodeChild(applyType, node, valueOrNode);
    } else if ((bindType === this.bindTypeDef.attr)) {
      this.applyAttr(applyType, node, key, valueOrNode);
    } else if ((bindType === this.bindTypeDef.thistext)
               || (bindType === this.bindTypeDef.thishtml)) {
      this.applyNodeThis(applyType, node, valueOrNode);
    }
  };
  this.applyNodeChild = function(applyType, parent, newNode) {
    switch (applyType) {
      case this.applyTypeDef.replace:
        if (newNode instanceof NodeList) {
          parent.replaceChildren();
          while (newNode.length > 0) parent.appendChild(newNode[0]);
        } else {
          parent.replaceChildren(newNode);
        }
        break;
      case this.applyTypeDef.prepend:
        if (newNode instanceof NodeList) {
          let existFirst = parent.firstChild;
          while (newNode.length > 0) parent.insertBefore(newNode[0], existFirst);
        } else {
          parent.insertBefore(newNode, parent.firstChild);
        }
        break;
      case this.applyTypeDef.append:
        if (newNode instanceof NodeList) {
          while (newNode.length > 0) parent.appendChild(newNode[0]);
        } else {
          parent.appendChild(newNode);
        }
        break;
    }
  };
  this.applyAttr = function(applyType, node, attrName, attrValue) {
    if (applyType === this.applyTypeDef.replace) {
      node.setAttribute(attrName, attrValue);
    } else {
      if (attrName === 'class') {
        node.classList.add(attrValue);
      } else {
        let existValue = '';
        if (node.hasAttribute(attrName)) {
          existValue = node.getAttribute(attrName);
        }
        switch (applyType) {
          case this.applyTypeDef.prepend:
            node.setAttribute(attrName, String(attrValue) + existValue);
            break;
          case this.applyTypeDef.append:
            node.setAttribute(attrName, existValue + String(attrValue));
            break;
        }
      }
    }
  };
  this.applyNodeThis = function(applyType, targetNode, newNode) {
    let parent = targetNode.parentElement;
    if (newNode instanceof NodeList) {
      while (newNode.length > 0) parent.insertBefore(newNode[0], targetNode);
    } else {
      parent.insertBefore(newNode, targetNode);
    }
  };

  this.event = {
    "definitions": [],
    "add": (selector, type, handler) => {
      this.event.definitions[selector] = {
        "selector": selector,
        "type": type,
        "handler": handler
      };
    },
    "remove": (selector) => {
      this.event.definitions.splice(this.event.definitions.indexOf(selector), 1);
    },
    "clear": () => {
      this.event.definitions = [];
    },
    "apply": (rootNode) => {
      for (let key of Object.keys(this.event.definitions)) {
        let def = this.event.definitions[key];
        rootNode.querySelectorAll(def.selector).forEach((elm) => {
          elm.addEventListener(def.type, def.handler);
        });
      }
    }
  };
};

