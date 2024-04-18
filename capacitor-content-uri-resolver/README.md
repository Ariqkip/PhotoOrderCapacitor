# capacitor-content-uri-resolver

helps in converting content uri to absolute path

## Install

```bash
npm install capacitor-content-uri-resolver
npx cap sync
```

## API

<docgen-index>

* [`echo(...)`](#echo)
* [`getAbsolutePathFromContentUri(...)`](#getabsolutepathfromcontenturi)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### echo(...)

```typescript
echo(options: { value: string; }) => Promise<{ value: string; }>
```

| Param         | Type                            |
| ------------- | ------------------------------- |
| **`options`** | <code>{ value: string; }</code> |

**Returns:** <code>Promise&lt;{ value: string; }&gt;</code>

--------------------


### getAbsolutePathFromContentUri(...)

```typescript
getAbsolutePathFromContentUri(options: { context: any; contentUri: string; }) => Promise<{ absolutePath: string; }>
```

| Param         | Type                                               |
| ------------- | -------------------------------------------------- |
| **`options`** | <code>{ context: any; contentUri: string; }</code> |

**Returns:** <code>Promise&lt;{ absolutePath: string; }&gt;</code>

--------------------

</docgen-api>
