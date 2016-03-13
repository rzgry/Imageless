/*********************************************************************
 *               Main Angular Controler for the popup                *
 *    It is in charge of tracking how  many filters the user         *   
 *     has enabled and saving/loading them to local storage          *
 *********************************************************************/

var MainController = function ($scope) {
    //load the array from logcal storage and if it empty fill it with inital values
    if (localStorage.getItem("filterArray") === null) {
        var temp = [{
            name: 'nsfw'
        }, {
            name: 'salad'
        }, {
            name: 'monkey'
        }, {
            name: 'slimy'
        }];
        //once we have created the temporary values save the file to local storage
        localStorage["filterArray"] = JSON.stringify(temp);
    }

    //load the array of filters to the filters section of the scope
    $scope.filters = JSON.parse(localStorage["filterArray"]);

    /*get the input textbox and the warning so we can change them as the user
    interacts with the UI*/
    var textbox = document.getElementById('textbox');
    var warning = document.getElementById('warningmsg');

    /*********************************************
     *                Add Filter                 *
     *********************************************/

    $scope.addFilter = function (name) {
        //if the name inputted is empty
        if (name === undefined) {
            //dislay a warning
            textbox.style.borderColor = "red";
            warning.textContent = 'Not a valid filter';
            return;
        }
        var newFilter = name.toLocaleLowerCase();
        document.getElementById('textbox').value = '';

        //loop through the array to make sure you arent adding an already existing filter
        var filtersLength = $scope.filters.length;
        var valid = true;
        for (var i = 0; i < filtersLength; i++) {
            //if the filter already exists
            if ($scope.filters[i].name === newFilter) {
                //set it to an invalid tag and display a warning
                valid = false;
                textbox.style.borderColor = "red";
                warning.textContent = 'Filter exists';
                return;
            }
        }

        //if it a valid filter to add push it onto the stack of filters
        if (valid) {
            $scope.filters.push({
                name: newFilter
            });
            //also remove any warnings and set the textbox border to success
            textbox.style.borderColor = "#33cc33";
            warning.textContent = '';
        }

        localStorage["filterArray"] = JSON.stringify($scope.filters);
    }

    /*********************************************
     *             Remove Filter                 *
     *********************************************/

    $scope.removeFilter = function (index) {
        $scope.filters.splice(index, 1);
        localStorage["filterArray"] = JSON.stringify($scope.filters);
    }


};
