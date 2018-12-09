$(function() {
  var restaurantsArray = [];
  var restaurantsIdArray = [];
  var hotelName = "";
  var address = "";
  var cuisines = "";
  var hasOnlineDelivery = "";
  var hasTableBooking = "";
  var photosUrl = "";
  var userrating = "";
  var userrating = {};
  /*function that exuctes on selecting a value from the drop down list of cities, 
    which retreives values for the next api request to pupulate the textbox with 
    Restaurants in that city
    */
  $("#selectCityName").on("change", function(e) {
    var optionSelected = $("option:selected", this);
    var ele = this.value;

    var userkey = "44792c3e1a2980afbe99f83d50409691";
    var url = "https://developers.zomato.com/api/v2.1/locations?query=";
    /*1st ajax request to obtain the city_id and entity_id values*/
    var city = ele;
    url = url + city;
    var settings = {
      async: true,
      crossDomain: true,
      url: url,
      method: "GET",
      headers: {
        "user-key": "44792c3e1a2980afbe99f83d50409691"
      }
    };

    $.ajax(settings).done(function(response) {
      // console.log(response);
      var city_id = response.location_suggestions[0].entity_id;
      var enti_type = response.location_suggestions[0].entity_type;
      // console.log(city_id + " " + enti_type);
      var resturl =
        "https://developers.zomato.com/api/v2.1/location_details?entity_id=" +
        city_id +
        "&entity_type=" +
        enti_type +
        "";
      /*2nd ajax request to list out the best restaurants in a city*/
      var settings = {
        async: true,
        crossDomain: true,
        url: resturl,
        method: "GET",
        headers: {
          "user-key": "44792c3e1a2980afbe99f83d50409691"
        }
      };

      $.ajax(settings).done(function(response) {
        var restarunts = response.best_rated_restaurant;
        var noOfRestarunts = restarunts.length;
        /*restaurantsArray -- Names of Restaurants
          restaurantsIdArray -- Id's of Restaurants, used in the next ajax request to obtain the details of a Restaurant*/
        for (var z = 0; z < noOfRestarunts; z++) {
          restaurantsArray.push(restarunts[z].restaurant.name);
          restaurantsIdArray.push(restarunts[z].restaurant.R.res_id);
        }
        // console.log(response);
        // console.log("total no of bestratedrestaurants in a city", restarunts.length);
        // console.log("Array of restaurants", restaurantsArray);
        // console.log("array of res_id", restaurantsIdArray);
      });
    });
  });
  /*auto-complete ,jqueryUI for sugeestion*/
  $("#input-restaurant").autocomplete({
    source: restaurantsArray
  });
  /*function executes on clicking the submit btn, that calculates the index, there by storing the res_id in a variable*/
  $("#submit-btn").click(function() {
    var hotelInputBoxValue = $("#input-restaurant").val();
    var index = restaurantsArray.indexOf(hotelInputBoxValue);
    var restaurantId = restaurantsIdArray[index];
    // console.log("res_id", restaurantId);

    /*3rd ajax request, to gather the details of the selected restaurant in the city using res_id value*/
    $.ajax({
      headers: {
        "user-key": "44792c3e1a2980afbe99f83d50409691"
      },
      url: "https://developers.zomato.com/api/v2.1/restaurant?res_id=",
      data: { res_id: restaurantId },
      type: "GET",
      success: function(data) {
        console.log("Restaurant description", data);
        hotelName = data.name;
        address = data.location.address;
        cuisines = data.cuisines;
        hasOnlineDelivery = data.has_online_delivery;
        hasTableBooking = data.has_table_booking;
        userrating = {
          aggregateRating: data.user_rating.aggregate_rating,
          ratingColor: data.user_rating.rating_color,
          ratingText: data.user_rating.rating_text,
          votes: data.user_rating.votes
        };
        /*display the details of Selected restaurant, by dynamically assigning the values using Jquery*/
        $("#Values").css("margin-top", "30px");
        $("#hotel-content").css("display", "block");
        $("#hotel-details").css("display", "block");
        $("#hotel-details").css("margin-bottom", "40px");
        $("#hotel-name").text("Hotel Name:" + " " + hotelName);
        $("#hotel-address").text("Address:" + " " + address);
        $("#hotel-cuisines").text("Cuisines:" + " " + cuisines);
        $("#hotel-averageRating").text("Aggregate Rating:" + " " + userrating.aggregateRating);
        $("#hotel-ratingText").text("Feedback:" + " " + userrating.ratingText);
        $("#hotel-votes").text("Votes:" + " " + userrating.votes);
        // console.log("Types of Cuisuines", cuisines);
        // alert(hotelName + " " + address + " " + cuisines + " " + userrating.aggregateRating);
      }
    });
  });
});
