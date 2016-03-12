var MainController = function ($scope) {
    $scope.filters = [
        {
            name: 'nsfw',
  },
        {
            name: 'tree',
  },

        {
            name: 'salad',
  },

        {
            name: 'monkey',
  }
]

    $scope.addFilter = function (name) {
        if (name === undefined || name === null || name === '') {
            return;
        }
        var filtersLength = $scope.filters.length;
        var newFilter = name.toLocaleLowerCase();
        document.getElementById('textbox').value = '';
        var valid = true;
        for (var i = 0; i < filtersLength; i++) {
            if ($scope.filters[i].name === newFilter) {
                valid = false;
            }
        }

        if (valid) {
            $scope.filters.push({
                name: newFilter
            });
        }
    }

    $scope.removeFilter = function (index) {
        $scope.filters.splice(index, 1);
    }

    $scope.saveFilters = function () {
        localStorage.setItem("names", JSON.stringify(names));
    }
};
