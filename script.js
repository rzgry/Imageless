var MainController = function ($scope) {
    console.log(JSON.parse(localStorage["filterArray"]));
    $scope.filters = JSON.parse(localStorage["filterArray"]);
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

        localStorage["filterArray"] = JSON.stringify($scope.filters);
    }

    $scope.removeFilter = function (index) {
        $scope.filters.splice(index, 1);
        localStorage["filterArray"] = JSON.stringify($scope.filters);
    }
};
