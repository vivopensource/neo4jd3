# NgNeo4jd3

## Package Installation Steps:

- using npm:
```
npm install ng-neo4jd3
```

- using yarn:
```
yarn add ng-neo4jd3
```

## Dependency Installation Steps:

### D3
- npm: `npm install d3`
- yarn: `yarn add d3`

### Font Awesome
- npm: `npm install font-awesome`
- yarn: `yarn add font-awesome`


## Add Style Files:

Supported style types are 'css' and 'scss'.

- CSS:
```
            "styles": [
              ...
              "node_modules/font-awesome/css/font-awesome.css",
              "node_modules/ng-neo4jd3/lib/assets/css/ng-neo4jd3.component.css",
              ...
```

- SCSS:
```
            "styles": [
              ...
              "node_modules/font-awesome/scss/font-awesome.scss",
              "node_modules/ng-neo4jd3/lib/assets/scss/ng-neo4jd3.component.scss",
              ...
```


## Adding 'twemoji' for node images:

***twemoji*** folder contains several predefined image in the ***svg*** format. These images can be displayed on the 'nodes' of the graph to provide a better UI.

- Location for putting ***twemoji***
    - Copy ***twemoji*** content from the directory ***node_modules/ng-neo4jd3/lib/assets/img/twemoji*** or ***node_modules/ng-neo4jd3/lib/assets/img/twemoji_test*** and paste the content within ***src/assets/img/twemoji*** directory


## Forked from 'eisman/neo4jd3'

[README](README_FORKED.md) of the fork 'eisman/neo4jd3'

## MIT LICENSE
