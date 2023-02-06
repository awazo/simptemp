# simptemp
javascript simple template engine

## how to use
1. apply src/simptemp.css and src/simptemp.js to your html.
2. `const simptemp = new Simptemp();`
3. `simptemp.inflate(template, data, container);`
    * `template`: template root element: has `class="template"` or `class="template-container"`
    * `data`: an array of object or an object
    * `container`: parent element the result of inflate appended to. it is optional, if not supplied the result of inflate (an array of elements) is returned.

* if you want to add event listener in the element in the template, use `simptemp.event.add(selector, type, handler)` before call inflate.
* `simptemp.inflateAsHtml(template, data);` returns inflated html string.
* CAUTION: key2html/key2thishtml uses innerHTML. so you have to [consider security](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML#security_considerations) .

## examples
### use `class="template"`
if a template is:
```
<div id="example-template" class="template">
  <span data-simptemp-key2text="example1"></span>
  <span data-simptemp-key2html="example1"></span>
  <span data-simptemp-key2attr="example1"></span>
  <span data-simptemp-key2attr="example1:attr,example2"></span>
  <span data-simptemp-key2thistext="example1"></span>
  <span data-simptemp-key2thishtml="example1"></span>
</div>
```
and a data is:
```
[
  {
    "example1": "<b>foo</b>",
    "example2": "foo"
  },
  {
    "example1": "<b>bar</b>",
    "example2": "bar"
  }
]
```
the result are:
```
<div>
  <span data-simptemp-key2text="example1">&lt;b&gt;foo&lt;/b&gt;</span>
  <span data-simptemp-key2html="example1"><b>foo</b></span>
  <span data-simptemp-key2attr="example1" example1="<b>foo</b>"></span>
  <span data-simptemp-key2attr="example1:attr,example2" attr="<b>foo</b>" example2="foo"></span>
  &lt;b&gt;foo&lt;/b&gt;
  <b>foo</b>
</div>
<div>
  <span data-simptemp-key2text="example1">&lt;b&gt;bar&lt;/b&gt;</span>
  <span data-simptemp-key2html="example1"><b>bar</b></span>
  <span data-simptemp-key2attr="example1" example1="<b>bar</b>"></span>
  <span data-simptemp-key2attr="example1:attr,example2" attr="<b>bar</b>" example2="bar"></span>
  &lt;b&gt;bar&lt;/b&gt;
  <b>bar</b>
</div>
```
### use `class="template-container"`
if a template is:
```
<div id="example-template" class="template-container">
  <span data-simptemp-key2text="example1"></span>
  <span data-simptemp-key2thistext="example1"></span>
</div>
```
and a data is:
```
[
  {
    "example1": "foo"
  },
  {
    "example1": "bar"
  }
]
```
the result are:
```
  <span data-simptemp-key2text="example1">foo</span>
  foo
  <span data-simptemp-key2text="example1">bar</span>
  bar
```

## reference
### template root element
An element has `class="template"` or has `class="template-container"` is template root element.
It's applied `display: none;` css by simptemp.css.
If root element has id attribute, it is removed.
The difference of the two classes are: template-container remove the root element, template isn't.
### data binding
* `data-simptemp-key2text="datakey"`: the value of `"datakey": value` is placed as the child text element of this element.
* `data-simptemp-key2html="datakey"`: the value of `"datakey": value` is placed as the child html element of this element.
* `data-simptemp-key2attr="datakey"`: the value of `"datakey": value` is placed as the attribute value of this element, and the attribute name is the key of the data `datakey`.
    * if you want to change the attribute name, `data-simptemp-key2attr="datakey:changedattrname"`.
    * if you want to bind multiple attributes, `data-simptemp-key2attr="datakey1,datakey2"`.
    * and the combination of upper twos are enable: `data-simptemp-key2attr="datakey1:newname1,datakey2:newname2"`, `data-simptemp-key2attr="datakey1:newname1,datakey2"` if only datakey1 wants to be changed.
* `data-simptemp-key2thistext="datakey"`: the value of `"datakey": value` is placed as the text element and replaced this element.
* `data-simptemp-key2thishtml="datakey"`: the value of `"datakey": value` is placed as the html element and replaced this element.
### data applying
* `data-simptemp-apply="replace"`: is default, replace the data to any data template has.
    * if key2text is "example1", apply is "replace" and data is `"example1": "value"`, template `<div ...>foo</div>` become `<div ...>value</div>`.
* `data-simptemp-apply="prepend"`: prepend the data to the value template has.
    * if key2text is "example1", apply is "prepend" and data is `"example1": "value"`, template `<div ...>foo</div>` become `<div ...>valuefoo</div>`.
* `data-simptemp-apply="append"`: append the data to the value template has.
    * if key2text is "example1", apply is "append" and data is `"example1": "value"`, template `<div ...>foo</div>` become `<div ...>foovalue</div>`.
* If you use key2attr and the target is "class" with prepend/append, value are separated with ' ' (a space) and also any order (prepend & append are same).
### event listener
* `simptemp.event.definitions`: hash object; key is selector, value is `{ "selector": selector, "type": type, "handler": handler }`, build by `simptemp.event.add` function.
* `simptemp.event.add(selector, type, handler)`: add event listener definition.
    * `selector`: selector string passing to querySelectorAll, selecting from template root element.
    * `type`: event type string passing to addEventListener.
    * `handler`: event handler function passing to addEventListener.
* `simptemp.event.remove(selector)`: remove event listener definition.
* `simptemp.event.clear()`: remove all event listener definitions.
* `simptemp.event.apply(rootNode)`: apply the event listeners in `simptemp.event.definitions` to the result of inflated, called in inflate function.

