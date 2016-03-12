//Javascript for the popup
var MainController = function ($scope) {
    //load the array of filters from local storage
    if (localStorage.getItem("filterArray") === null) {
        var temp = [{name: 'nsfw'} , {name: 'salad'} , {name: 'monkey'} , { name: 'slimy'}]; 
        localStorage["filterArray"] = JSON.stringify(temp);
    }
    $scope.filters = JSON.parse(localStorage["filterArray"]);

    console.log(document.body);
    //method for adding filters to the filter arrays
    $scope.addFilter = function (name) {
        //if the name inputted is empty
        if (name === undefined || name === null || name === '') {
            return;
        }
        var newFilter = name.toLocaleLowerCase();
        document.getElementById('textbox').value = '';

        //loop through the array to make sure you arent adding an already existing filter
        var filtersLength = $scope.filters.length;
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

    //method for removing filters from the filter array
    $scope.removeFilter = function (index) {
        $scope.filters.splice(index, 1);
        localStorage["filterArray"] = JSON.stringify($scope.filters);
    }
};
