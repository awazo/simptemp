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

  this.attrNameBind2Text = 'data-simptemp-key2text';
  this.attrNameBind2Html = 'data-simptemp-key2html';
  this.attrNameBind2Attr = 'data-simptemp-key2attr';
  this.attrNameBind2ThisText = 'data-simptemp-key2thistext';
  this.attrNameBind2ThisHtml = 'data-simptemp-key2thishtml';
  this.attrNameApply = 'data-simptemp-apply';
  this.attrNameAttrName = 'data-simptemp-attrname';

  this.bindTypeDef = { 'text': 0, 'html': 1, 'attr': 2, 'thistext': 3, 'thishtml': 4 };
  this.applyTypeDef = { 'replace': 0, 'prepend': 1, 'append': 2 };

  this.bindKey = function(rootElement, key, value) {
    let simptemp = this;

    let selBind2Text = '[' + this.attrNameBind2Text + '=' + key + ']';
    rootElement.querySelectorAll(selBind2Text).forEach(function(elm) {
      let textNode = document.createTextNode(value);
      simptemp.applyData(simptemp.bindTypeDef.text, elm, key, textNode);
    });

    let selBind2Html = '[' + this.attrNameBind2Html + '=' + key + ']';
    rootElement.querySelectorAll(selBind2Html).forEach(function(elm) {
      let htmlParent = document.createElement('div');
      htmlParent.innerHTML = value;
      let nodes = htmlParent.childNodes;
      simptemp.applyData(simptemp.bindTypeDef.html, elm, key, nodes);
    });

    let selBind2Attr = '[' + this.attrNameBind2Attr + '=' + key + ']';
    rootElement.querySelectorAll(selBind2Attr).forEach(function(elm) {
      let attrName = key;
      if (elm.hasAttribute(simptemp.attrNameAttrName)) {
        attrName = elm.getAttribute(simptemp.attrNameAttrName);
      }
      simptemp.applyData(simptemp.bindTypeDef.attr, elm, attrName, value);
    });

    let selBind2ThisText = '[' + this.attrNameBind2ThisText + '=' + key + ']';
    rootElement.querySelectorAll(selBind2ThisText).forEach(function(elm) {
      let textNode = document.createTextNode(value);
      simptemp.applyData(simptemp.bindTypeDef.thistext, elm, key, textNode);
    });
    let nodesThisTextRemove = rootElement.querySelectorAll(selBind2ThisText);
    for (let i = 0; i < nodesThisTextRemove.length; i++) {
      nodesThisTextRemove[i].remove();
    }

    let selBind2ThisHtml = '[' + this.attrNameBind2ThisHtml + '=' + key + ']';
    rootElement.querySelectorAll(selBind2ThisHtml).forEach(function(elm) {
      let htmlParent = document.createElement('div');
      htmlParent.innerHTML = value;
      let nodes = htmlParent.childNodes;
      simptemp.applyData(simptemp.bindTypeDef.thishtml, elm, key, nodes);
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
};

