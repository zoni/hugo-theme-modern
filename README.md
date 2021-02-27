# Modern

This is the _"Modern"_ theme I currently use on [nick.groenen.me].

It is a fork of the [Hello Friend] theme by [panr].

## CSS changes

Changes to CSS should be done in `assets/postcss/*`.

While making changes, you'll want to have postcss running:

```
node_modules/.bin/postcss --watch --poll --no-map assets/postcss/style.css --output assets/css/style.css
```

## Licence

This theme is provided under the [MIT] license.

[Hello Friend]: https://github.com/panr/hugo-theme-hello-friend
[MIT]: LICENSE.md
[nick.groenen.me]: https://nick.groenen.me/
[panr]: https://github.com/panr/
