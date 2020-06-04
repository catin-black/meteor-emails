import "/imports/perfectScrollbar.js";

const paperDashboard = {
  misc: {
    navbar_menu_visible: 0,
  },

  initMinimizeSidebar: function () {
    if ($(".sidebar-mini").length != 0) {
      sidebar_mini_active = true;
    }

    $("#minimizeSidebar").click(function () {
      if (sidebar_mini_active == true) {
        $("body").addClass("sidebar-mini");
        sidebar_mini_active = true;
        paperDashboard.showSidebarMessage("Sidebar mini activated...");
      } else {
        $("body").removeClass("sidebar-mini");
        sidebar_mini_active = false;
        paperDashboard.showSidebarMessage("Sidebar mini deactivated...");
      }

      // we simulate the window Resize so the charts will get updated in realtime.
      var simulateWindowResize = setInterval(function () {
        window.dispatchEvent(new Event("resize"));
      }, 180);

      // we stop the simulation of Window Resize after the animations are completed
      setTimeout(function () {
        clearInterval(simulateWindowResize);
      }, 1000);
    });
  },

  showSidebarMessage: function (message) {
    try {
      $.notify(
        {
          icon: "now-ui-icons ui-1_bell-53",
          message: message,
        },
        {
          type: "info",
          timer: 4000,
          placement: {
            from: "top",
            align: "right",
          },
        }
      );
    } catch (e) {
      console.log(
        "Notify library is missing, please make sure you have the notifications library added."
      );
    }
  },
};

Template.layoutPanel.helpers({});

Template.layoutPanel.events({
  "click .navbar-toggle": function (argument) {
    $toggle = $(this);
    if (paperDashboard.misc.navbar_menu_visible == 1) {
      $("html, .main-panel, .sidebar, body").removeClass("nav-open");
      paperDashboard.misc.navbar_menu_visible = 0;
      setTimeout(function () {
        $toggle.removeClass("toggled");
        $("#bodyClick").remove();
      }, 550);
    } else {
      setTimeout(function () {
        $toggle.addClass("toggled");
      }, 580);

      div = '<div id="bodyClick"></div>';
      $(div)
        .appendTo("body")
        .click(function () {
          $("html, .main-panel, .sidebar, body").removeClass("nav-open");
          paperDashboard.misc.navbar_menu_visible = 0;
          setTimeout(function () {
            $toggle.removeClass("toggled");
            $("#bodyClick").remove();
          }, 550);
        });

      $("html, .main-panel, .sidebar, body").addClass("nav-open");
      paperDashboard.misc.navbar_menu_visible = 1;
    }
  },
  "focus .form-control": function (argument) {
    $(this).parent(".input-group").addClass("input-group-focus");
  },
  "blur .form-control": function (argument) {
    $(this).parent(".input-group").removeClass("input-group-focus");
  },
});

Template.layoutPanel.onRendered(function () {
  transparent = true;
  transparentDemo = true;
  fixedTop = false;
  navbar_initialized = false;
  backgroundOrange = false;
  sidebar_mini_active = false;
  toggle_initialized = false;
  (seq = 0), (delays = 80), (durations = 500);
  (seq2 = 0), (delays2 = 80), (durations2 = 500);
  if ($(".full-screen-map").length == 0 && $(".bd-docs").length == 0) {
    // On click navbar-collapse the menu will be white not transparent
    $(".collapse")
      .on("show.bs.collapse", function () {
        $(this)
          .closest(".navbar")
          .removeClass("navbar-transparent")
          .addClass("bg-white");
      })
      .on("hide.bs.collapse", function () {
        $(this)
          .closest(".navbar")
          .addClass("navbar-transparent")
          .removeClass("bg-white");
      });
  }
  paperDashboard.initMinimizeSidebar();
  $navbar = $(".navbar[color-on-scroll]");
  scroll_distance = $navbar.attr("color-on-scroll") || 500;
  // Check if we have the class "navbar-color-on-scroll" then add the function to remove the class "navbar-transparent" so it will transform to a plain color.
  if ($(".navbar[color-on-scroll]").length != 0) {
    paperDashboard.checkScrollForTransparentNavbar();
    $(window).on("scroll", paperDashboard.checkScrollForTransparentNavbar);
  }
  // Activate bootstrapSwitch
  $(".bootstrap-switch").each(function () {
    $this = $(this);
    data_on_label = $this.data("on-label") || "";
    data_off_label = $this.data("off-label") || "";

    $this.bootstrapSwitch({
      onText: data_on_label,
      offText: data_off_label,
    });
  });
  $(window).resize(function () {
    // reset the seq for charts drawing animations
    seq = seq2 = 0;

    if ($(".full-screen-map").length == 0 && $(".bd-docs").length == 0) {
      $navbar = $(".navbar");
      isExpanded = $(".navbar")
        .find('[data-toggle="collapse"]')
        .attr("aria-expanded");
      if ($navbar.hasClass("bg-white") && $(window).width() > 991) {
        $navbar.removeClass("bg-white").addClass("navbar-transparent");
      } else if (
        $navbar.hasClass("navbar-transparent") &&
        $(window).width() < 991 &&
        isExpanded != "false"
      ) {
        $navbar.addClass("bg-white").removeClass("navbar-transparent");
      }
    }
  });
});

Template.layoutPanel.onDestroyed(function () {});

function hexToRGB(hex, alpha) {
  var r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16);

  if (alpha) {
    return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
  } else {
    return "rgb(" + r + ", " + g + ", " + b + ")";
  }
}
