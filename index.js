(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.listToTree = factory();
  }
}(this, function () {
    'use strict';
    return function listToTree(data, options) {
      options = options || {};
      var ID_KEY = options.idKey || 'id';
      var PARENT_KEY = options.parentKey || 'parent';
      var CHILDREN_KEY = options.childrenKey || 'children';

      // append children objects if they already exists
      var APPEND_CHILDREN = typeof options.appendChildren !== 'undefined' ? options.appendChildren : true;

      var tree = [], childrenOf = {};
      var item, id, parentId;

      /**
       * Recursive search children object of item by item id
       * @param {Object[]} data
       * @param {int} id
       * @return {Object[]|null} Children object or null if not found
       */
      var findChildrenByItemId = function (data, id) {
        var result;

        for (var i = 0, length = data.length; i < length; i++) {
          var item = data[i];

          if (item[CHILDREN_KEY]) {
            if (item[ID_KEY] === id) {
              return item[CHILDREN_KEY];
            } else {
              result = findChildrenByItemId(item[CHILDREN_KEY], id);
              if (result) {
                return result;
              }
            }
          }
        }

        return null;
      };

      /**
       * Get children object by item id with "caching"
       * @param int id
       * @return {Object[]} Children object
       */
      var getChildrenByItemId = function (id) {
        if (childrenOf[id]) {
          return childrenOf[id];
        }

        if (APPEND_CHILDREN) {
          childrenOf[id] = findChildrenByItemId(data, id);
        }

        if (!childrenOf[id]) {
          // every item may have children
          childrenOf[id] = [];
        }

        return childrenOf[id];
      };

      for (var i = 0, length = data.length; i < length; i++) {
        item = data[i];
        id = item[ID_KEY];
        parentId = item[PARENT_KEY] || 0;
        // init its children
        item[CHILDREN_KEY] = getChildrenByItemId(id);
        if (parentId != 0) {
          // push it into its parent's children object
          if (getChildrenByItemId(parentId).indexOf(item) === -1) {
            getChildrenByItemId(parentId).push(item);
          }
        } else {
          tree.push(item);
        }
      }

      return tree;
    }
}));