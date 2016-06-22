(function() {
looker.plugins.visualizations.add({

  // ---------------------------------------------------------------------------------------------------------------------------
  //
  //  This part adds the details about your visualization
  //
  // ---------------------------------------------------------------------------------------------------------------------------

    id: 'unique_id',
    label: 'Display Label',
    options: {


  // ---------------------------------------------------------------------------------------------------------------------------
  //
  //  Here you list all your options to appear in the edit window:
  //      type: array, string, boolean, 
  //      label: Label
  //      section: creates a new tab
  //      placeholder: faint/example text to indicate how to write the setting
  //      display: Select, Radio, Colors, Null (text)
  //      values: options to provide (radio buttons, drop downs)
  //      default: Default value of the setting
  //      order: order on the page Sm --> Lg
  //
  // ---------------------------------------------------------------------------------------------------------------------------


  // put your settings here, they live in the settings variable

      // colorRange: {
      //   type: 'array',
      //   label: 'Color Ranges',
      //   section: 'Style',
      //   placeholder: '#fff, red, etc...'
      // }
  }
,
  handleErrors: function(data, resp) {

  // ---------------------------------------------------------------------------------------------------------------------------
  //
  //  This function deals with errors in your data: one measure when you need two, use a pivot, etc. It returns true or false
  //
  // ---------------------------------------------------------------------------------------------------------------------------


    // insert IF statements that return false when not met

    var min_mes, max_mes, min_dim, max_dim, min_piv, max_piv;
    min_mes = 0
    max_mes = 10
    min_dim = 0
    max_dim = 10
    min_piv = 0
    max_piv = 10

    if (resp.fields.pivots.length > max_piv) {
      this.addError({
        group: 'pivot-req',
        title: 'Incompatible Data',
        message: 'No pivot is allowed'
      });
      return false;
    } else {
      this.clearErrors('pivot-req');
    }

    if (resp.fields.pivots.length < min_piv) {
      this.addError({
        group: 'pivot-req',
        title: 'Incompatible Data',
        message: 'Add a Pivot'
      });
      return false;
    } else {
      this.clearErrors('pivot-req');
    }

    if (resp.fields.dimensions.length > max_dim) {
      this.addError({
        group: 'dim-req',
        title: 'Incompatible Data',
        message: 'You need ' + min_dim +' to '+ max_dim +' dimensions'
      });
      return false;
    } else {
      this.clearErrors('dim-req');
    }

    if (resp.fields.dimensions.length < min_dim) {
      this.addError({
        group: 'dim-req',
        title: 'Incompatible Data',
        message: 'You need ' + min_dim +' to '+ max_dim +' dimensions'
      });
      return false;
    } else {
      this.clearErrors('dim-req');
    }

    if (resp.fields.pivots.length > max_mes) {
      this.addError({
        group: 'mes-req',
        title: 'Incompatible Data',
        message: 'You need ' + min_mes +' to '+ max_mes +' measures'
      });
      return false;
    } else {
      this.clearErrors('mes-req');
    }

    if (resp.fields.pivots.length < min_mes) {
      this.addError({
        group: 'mes-req',
        title: 'Incompatible Data',
        message: 'You need ' + min_mes +' to '+ max_mes +' measures'
      });
      return false;
    } else {
      this.clearErrors('mes-req');
    }




    // If no errors found, then return true
    return true;
  },


  create: function(element, settings) {

  // ---------------------------------------------------------------------------------------------------------------------------
  //
  //  This function creates whatever html elements you need to put your vis in, its ran when you select your visualization, 
  //  make sure to clear the old visualization first!
  //
  // ---------------------------------------------------------------------------------------------------------------------------



  // clear it
    d3.select(element);
      .selectAll("*").remove();
        // .append("svg");  


        // Add stuff to your element





        },
  update: function(data, element, settings, resp) {

  // ---------------------------------------------------------------------------------------------------------------------------
  //
  //  This function is ran whenever a change is made (Run button, setting change, refresh, resize) It will create your 
  //  visualization, make sure to clear the old visualization first!
  //
  // ---------------------------------------------------------------------------------------------------------------------------


  if (!this.handleErrors(data, resp)) return;  // Check for errors!

  // View your data :

    // console.log(data); // (Data object)
    // console.log(resp); // (Metadata object)
    // console.log(settings); // (User inputted settings object)
    // console.log(element); // (HTML element)


    // console.log(resp.fields.dimensions[0].name);
    // console.log(resp.fields.pivots[0].name);
    // console.log(resp.fields.measures[0].name);

// Declare any variables

// // Height and Width
      // h = $(element).height();
      // w = $(element).width();


        }

      })
    

}());
