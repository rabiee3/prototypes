(function (window, undefined) {
   	window.jimUtil.fitted = true;
    window.jimUtil.scale = 100;
    window.jimUtil.modelWidth = 1366.0;

    jQuery(window)
        .bind("resize", function() {
            if (jimUtil.fitted) {
                jimUtil.fitToScreen();
                jimUtil.refreshPageMinSize();
            }
       	});      
})(window);