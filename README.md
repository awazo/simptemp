# simptemp
javascript simple template engine

## how to use
1. apply src/simptemp.css and src/simptemp.js to your html.
2. `const simptemp = new Simptemp();`
3. `simptemp.inflate(template, data, container);`
    * template is template root element: has `class="template"` or `class="template-container"`
    * data is an array of object or an object
    * container is parent element for the result of inflate. it is optional, if not supplied the result of inflate (an array of elements) is returned.

## examples
### use `class="template"`
if a template is:
```
<div id="example-template" class="template">
  <span data-simptemp-key2text="example1"></span>
  <span data-simptemp-key2html="example1"></span>
  <span data-simptemp-key2attr="example1"></span>
  <span data-simptemp-key2attr="example1" data-simptemp-attrname="attr"></span>
  <span data-simptemp-key2thistext="example1"></span>
  <span data-simptemp-key2thishtml="example1"></span>
</div>
```
and a data is:
```
[
  {
    "example1": "<b>foo</b>"
  },
  {
    "example1": "<b>bar</b>"
  }
]
```
the result are:
```
<div>
  <span data-simptemp-key2text="example1">&lt;b&gt;foo&lt;/b&gt;</span>
  <span data-simptemp-key2html="example1"><b>foo</b></span>
  <span data-simptemp-key2attr="example1" example1="<b>foo</b>"></span>
  <span data-simptemp-key2attr="example1" data-simptemp-attrname="attr" attr="<b>foo</b>"></span>
  &lt;b&gt;foo&lt;/b&gt;
  <b>foo</b>
</div>
<div>
  <span data-simptemp-key2text="example1">&lt;b&gt;bar&lt;/b&gt;</span>
  <span data-simptemp-key2html="example1"><b>bar</b></span>
  <span data-simptemp-key2attr="example1" example1="<b>bar</b>"></span>
  <span data-simptemp-key2attr="example1" data-simptemp-attrname="attr" attr="<b>bar</b>"></span>
  &lt;b&gt;bar&lt;/b&gt;
  <b>bar</b>
</div>
```
### use `class="template-container"`
if a template is:
```
<div id="example-template" class="template-container">
  <span data-simptemp-key2text="example1"></span>
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
  <span data-simptemp-key2text="example1">bar</span>
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
    * use `data-simptemp-attrname="attr"` if you change the attribute name.
* `data-simptemp-key2thistext="datakey"`: the value of `"datakey": value` is placed as the text element and replaced this element.
* `data-simptemp-key2thishtml="datakey"`: the value of `"datakey": value` is placed as the html element and replaced this element.
### data applying
* `data-simptemp-apply="replace"`: is default, replace the data to any data template has.
    * if key2text is "example1", apply is "replace" and data is `"example1": "value"`, template `<div ...>foo</div>` become `<div ...>value</div>`. 
* `data-simptemp-apply="prepend": prepend the data to the value template has.
    * if key2text is "example1", apply is "prepend" and data is `"example1": "value"`, template `<div ...>foo</div>` become `<div ...>valuefoo</div>`. 
* `data-simptemp-apply="append": append the data to the value template has.
    * if key2text is "example1", apply is "append" and data is `"example1": "value"`, template `<div ...>foo</div>` become `<div ...>foovalue</div>`. 
* If you use key2attr and attrname="class" with prepend/append, value are separated with ' ' (a space) and also any order (prepend & append are same).

