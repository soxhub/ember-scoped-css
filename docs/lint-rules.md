## scoped-class-helper

This rule checks if `scoped-class` helper has one positional param of type StringLiteral.
The following example shows the correct use of the helper:

```hbs
<SomeComponent @class={{scoped-class 'first-class second-class'}} />
```

### Examples

This rule forbids the following:

1. Wrong number of positional params

```hbs
<SomeComponent @class={{scoped-class}} />
<SomeComponent @class={{scoped-class 'first-class' 'second-param'}} />
```

2. Dynamic properties

```hbs
<SomeComponet @class={{scoped-class this.myClass}} />
```
