
# Ng-Neo4jd3

Library for Visualizing Data in form of Graphs with Nodes in Angular using D3




## Package Installation Steps:

- using node package manager (npm):
```
npm install ng-neo4jd3
```

- using yarn:
```
yarn add ng-neo4jd3
```

package link in [npm](https://www.npmjs.com/package/ng-neo4jd3) and [yarn](https://yarnpkg.com/package/ng-neo4jd3)




## Dependency Installation Steps:

### D3
 - npm: `npm install d3`
 - yarn: `yarn add d3`

### Font Awesome
 - npm: `npm install font-awesome`
 - yarn: `yarn add font-awesome`




## Add Style Files:

Supported style types are 'css' and 'scss'. The following code snippet needs to be added with 'angular.json' file.

### CSS:
```
            "styles": [
              ...
              "node_modules/font-awesome/css/font-awesome.css",
              "node_modules/ng-neo4jd3/lib/assets/css/ng-neo4jd3.component.css",
              ...
```

### SCSS:
```
            "styles": [
              ...
              "node_modules/font-awesome/scss/font-awesome.scss",
              "node_modules/ng-neo4jd3/lib/assets/scss/ng-neo4jd3.component.scss",
              ...
```


## Adding 'twemoji' for node images:

***twemoji*** folder contains several predefined image in the ***svg*** format. These images can be displayed on the 'nodes' of the graph to provide a better UI.

 - Location for putting `twemoji`
    - Copy `twemoji` content from the directory __node_modules/ng-neo4jd3/lib/assets/img/twemoji__ or __node_modules/ng-neo4jd3/lib/assets/img/twemoji_test__ and paste the content within __src/assets/img/twemoji__ directory


## Implemenation References

 - Test Repository: [ng-neo4jd3-test](https://github.com/vivopensource/ng-neo4jd3-test)

 - Reference Files:
   - Model: [ng-neo4jd3.model.ts](https://github.com/vivopensource/ng-neo4jd3-app/blob/master/projects/ng-neo4jd3/src/lib/ng-neo4jd3.model.ts)
   - Records: [ng-neo4jd3.records.ts](https://github.com/vivopensource/ng-neo4jd3-app/blob/master/projects/ng-neo4jd3/src/lib/ng-neo4jd3.records.ts)
   - Icons: [ng-neo4jd3.icons.ts](https://github.com/vivopensource/ng-neo4jd3-app/blob/master/projects/ng-neo4jd3/src/lib/ng-neo4jd3.icons.ts)



## Forked from 'eisman/neo4jd3'

[README](README_FORKED.md) of the fork 'eisman/neo4jd3'


## LICENSE: MIT
