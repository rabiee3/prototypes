(function(window, undefined) {
  var dictionary = {
    "6401fdde-f51d-429f-a9b9-04011e288b4c": "Dashboard",
    "13ec7994-f29b-4341-9edf-efb09138f628": "Add New Schedule",
    "e45f1708-671a-4198-8f9d-5f12af802406": "Add New Task",
    "b68f61bc-a821-46a3-b2b4-80a8a369f5e5": "Task Details",
    "d12245cc-1680-458d-89dd-4f0d7fb22724": "Login",
    "d77cfc10-62f9-4f60-9550-7090c7c6f03f": "Tasks",
    "e5d58afa-67a7-46bb-9a6e-072958167a2a": "SideMenu",
    "f39803f7-df02-4169-93eb-7547fb8c961a": "Template 1",
    "bb8abf58-f55e-472d-af05-a7d1bb0cc014": "Board 1"
  };

  var uriRE = /^(\/#)?(screens|templates|masters|scenarios)\/(.*)(\.html)?/;
  window.lookUpURL = function(fragment) {
    var matches = uriRE.exec(fragment || "") || [],
        folder = matches[2] || "",
        canvas = matches[3] || "",
        name, url;
    if(dictionary.hasOwnProperty(canvas)) { /* search by name */
      url = folder + "/" + canvas;
    }
    return url;
  };

  window.lookUpName = function(fragment) {
    var matches = uriRE.exec(fragment || "") || [],
        folder = matches[2] || "",
        canvas = matches[3] || "",
        name, canvasName;
    if(dictionary.hasOwnProperty(canvas)) { /* search by name */
      canvasName = dictionary[canvas];
    }
    return canvasName;
  };
})(window);