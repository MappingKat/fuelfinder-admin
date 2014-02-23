    var header_height = 60;
    var footer_height = 15;
    var map_height_min = 350;

    function resize() {
      var non_map_content_height = header_height + footer_height;
      var map_height = map_height_min;
      var difference = $(window).height( ) - non_map_content_height;
      if ( difference > map_height )
        map_height = difference;

      $("#map").css( 'height', map_height );
    }
