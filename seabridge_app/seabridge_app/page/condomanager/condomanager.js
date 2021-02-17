frappe.pages['condomanager'].on_page_load = function(wrapper) {
	var parent = $('<div class="condomanager"></div>').appendTo(wrapper);
		parent.html(frappe.render_template("condomanager", {}));


$(document).ready(function() {

		var xhttp;
          xhttp=new XMLHttpRequest();
	  
           xhttp.onreadystatechange = async function() {
            if (this.readyState == 4 && this.status == 200) {
                //callBack(this);
		result=JSON.parse(this.responseText)
		condomanagerdashboard.initdataTable(result);
		
		
            }
          };
          xhttp.open('GET','/api/method/seabridge_app.seabridge_app.api.web_form_call',true);

          xhttp.send();

   // condomanagerdashboard.initdataTable();
    $(".multiselectbtnsubmit").css("display", "none");
    $(".multiselectbtnapprove").css("display", "none");
    $(".multiselectbtnreject").css("display", "none");
    $(".multiselectbtnpayment").css("display", "none");
    $('.checked_all').on('change', function() {     
                $('.checkbox').prop('checked', $(this).prop("checked")); 
                //$(".multiselectbtnsubmit").css("display", "block"); 
                //$(".multiselectbtnapprove").css("display", "block");   
                if($('.checkbox:checked').length == 0){
    
    $(".multiselectbtnsubmit").css("display", "none");
    $(".multiselectbtnapprove").css("display", "none");
    $(".multiselectbtnreject").css("display", "none");
  }
  else{
       $(".multiselectbtnsubmit").css("display", "block");
	$(".multiselectbtnapprove").css("display", "block");
      }           
        });
        $('.checkbox').on('change', function() {  //".checkbox" change 
       
        $( ".multiselectbtnsubmit" ).insertAfter( $( "#condotable" ) );
	//$( ".multiselectbtnapprove" ).insertAfter( $( "#condotable" ) );
	
});
})

condomanagerdashboard = {
     
    
    initdataTable: function (result) {
var condodata=[]
	console.log(condodata)
for(i=0;i<result['message'].length;i++){
if(result['message'][i][7]==1){
var match="Y"}
else{var match="N"	}
condodata.push(
		{"vendor":result['message'][i][1],"invoice":result['message'][i][0], "poamount":result['message'][i][5], "invamount":result['message'][i][2], "allocatedbudget":result['message'][i][9], "purchaseorderdate":result['message'][i][6], "invoiceduedate":result['message'][i][3], "match":match, "pendingwith":result['message'][i][8], "status":result['message'][i][4]},	
		)
}

      let elementArray = [
        {
          id: "condo-Inv",
          title: "Vendor",
          number: 1,
          className: "col-md-3 condo-select",
        },
        {
          id: "condo-title",
          title: "Match",
          number: 8,
          className: "col-md-3 condo-select",
        },
  
        {
          id: "condo-pending",
          title: "Pending With",
          number: 9,
          className: "col-md-3 condo-select",
        },
      ];
  
      let dataSet = {
        data:condodata,
        columns: [
          {
            data: null,
            width: "1%",
            class: "text-break text-center checkval",
	    id: "checkval",
            render: function (data, row) {
		var email;
		if(data['match']=="Y" && data['status']=="Pending"){
		frappe.call({
		        method:"seabridge_app.seabridge_app.api.get_user_email",
		        args:{
				name:frappe.session.user
			},
		        async:false,
		        callback: function(r){
				if(r.message){
				email=r.message 	
				}	
			}
						
		    });
			if(email){

					return '<input name="product" class="checkbox" type="checkbox">';
				}
				else{
					return '<input name="product" class="checkbox" type="checkbox" disabled>';
				}
		}
		else if(data['status']=="Draft" || data['status']=="Rejected"){
		frappe.call({
		        method:"seabridge_app.seabridge_app.api.get_user_estate_role",
		        args:{
				name:frappe.session.user
			},
		        async:false,
		        callback: function(r){
				if(r.message){
				email=r.message 	
				}	
			}
						
		    });
			if(email){

					return '<input name="product" class="checkbox" type="checkbox">';
				}
				else{
					return '<input name="product" class="checkbox" type="checkbox" disabled>';
				}
		}
		else{
			return '<input name="product" class="checkbox" type="checkbox" disabled>';
		}
            },
            
          },
          
	  {
            data: "vendor",
            width: "13%",
            class: "text-break text-center vendor",
          },
          {
            data: "invoice",
            width: "13%",
            class: "text-break text-center invoice",
            render: function (data, row) {
              return '<a href="/desk#Form/Purchase Invoice/'+data+'" target="_blank"><u>' + data + '</u></a>';
            },
            
          },
          {
            data: "poamount",
            width: "10%",
            class: "text-break text-right",
          },
	  {
            data: "invamount",
            width: "8%",
            class: "text-break text-right",
          },
         
          {
            data: "allocatedbudget",
            width: "9%",
            class: "text-break text-right",
          },
          {
            data: "purchaseorderdate",
            width: "12%",
            class: "text-break text-center",
          },
          {
            data: "invoiceduedate",
            width: "12%",
            class: "text-break text-center",
          },
          {
            data: "match",
	    width: "9%",
            class: "text-break text-center",
          },
          {
            data: "pendingwith",
            width: "9%",
            class: "text-break text-center",
            render: function (data, row) {
              let test = data;
              return data;
              return '<a href="' + data + '" target="_blank">' + row.linkName+ '</a>';
            },
          },
          {
            data: null,
	    value:"vendor",
            width: "6%",
            class: "text-break text-center status",
  
            render: function (data, value,row) {
              if (data['status'] == "Submitted") {
		
                return `<button
                          class="btn btn-primary btn-success btn-sm btn-fill condo-btn details-control">Pending</button>`;
              } else if (data['status'] == "Pending") {
                return `<button
                          class="btn btn-primary btn-warning btn-sm btn-fill condo-btn details-control">Submitted</button>`;
              }
		else if (data['status'] == "To Bill") {
                return `<button
                          class="btn btn-primary btn-warning btn-sm btn-fill condo-btn details-control">Approved</button>`;
              } 
		else if (data['status'] == "Paid") {
                return `<button
                          class="btn btn-primary btn-warning btn-sm btn-fill condo-btn details-control">Paid</button>`;
              }
		else if (data['status'] == "Rejected") {
                return `<button
                          class="btn btn-primary btn-danger btn-sm btn-fill condo-btn details-control">Rejected</button>`;
              }
		 else {
                return `<button
                          class="btn btn-primary btn-sm btn-fill condo-btn details-control">Draft</button>`;
              }
              
            },
          },
          // {
          //   data: null,
          //   width: "10%",
          //   class: "text-break text-center",
          //   render: function (data, type, row) {
          //     console.log(row.vendor);
          //     if (row.status == "Paid") {
          //       return `
          //                 <div class="details-control btn btn-sm btn-primary btn-warning condo-btn btn-icon edit"><i class="ti-eye"></i> Invoice</div>`;
          //     } else {
          //       return `<button
          //                 class="btn btn-primary btn-success btn-sm btn-fill condo-btn">Approve</button>
          //                 <button
          //                 class="btn btn-primary btn-danger btn-sm btn-fill condo-btn reject-btn">Reject</button>
          //                 `;
          //     }
          //   },
          // },
        ],
        valueRow: [2],
      };
	var first_data=dataSet;
      buttonElements = {
        id: "condo-reset",
        filterId: "#condotable_filter",
        className: "condo-reset",
        select: "condo-select",
      };
  
      var table = createDataTables.createTable(
        "#condotable",
        dataSet,
        elementArray,
        buttonElements
      );
      table.columns.adjust().draw();
  
      $("#condotable tbody").on("change", "td input.checkbox",function(){ //".checkbox" change 
      if($('.checkbox:checked').length == 0){
	
      
        $(".multiselectbtnsubmit").css("display", "none");
	$(".multiselectbtnapprove").css("display", "none");
	$(".multiselectbtnreject").css("display", "none");
      }
      else{
		frappe.call({
		        method:"seabridge_app.seabridge_app.api.get_user_email",
		        args:{
				name:frappe.session.user
			},
		        async:false,
		        callback: function(r){
			    if(r.message){
				   
				   $(".multiselectbtnapprove").css("display", "block");
				   $(".multiselectbtnreject").css("display", "block");
				  }
				}
		})
		frappe.call({
		        method:"seabridge_app.seabridge_app.api.get_user_estate_role",
		        args:{
				name:frappe.session.user
			},
		        async:false,
		        callback: function(r){
			    if(r.message){
				   
				   $(".multiselectbtnsubmit").css("display", "block");
				  }
				}
		})
		
	
	
	}
          if($('.checkbox:checked').length == $('.checkbox').length){
           
                       $('.checked_all').prop('checked',true);
                     
                }else{
                   
                       $('.checked_all').prop('checked',false);
                  
                }
    })
	

  
	function get_paid_invoices(vendor_name){
		var xhttp;
          xhttp=new XMLHttpRequest();
	  var result_in;
           xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                //callBack(this);
		result_in=JSON.parse(this.responseText)
		 after_click(result_in);
            }
          };
          xhttp.open('GET','/api/method/seabridge_app.seabridge_app.api.web_call_vendor?vendor='+vendor_name,true);
          xhttp.send();
	}

      $("#condotable tbody").on("click", "td button.details-control", function () {
        $("tr").removeClass("shown");
        $("#detailcondo_wrapper").remove();
        var tr = $(this).closest("tr");
        var vendor_name = $(this).parent().siblings('.vendor').text();
	get_paid_invoices(vendor_name)
        // var table=  $(this).closest('table');
        var row = table.row(tr);
  
        if (row.child.isShown()) {
          // This row is already open - close it
          row.child.hide();
          tr.removeClass("shown");
        } else {
          // Open this row
  
          row.child(format(row.data())).show();
          tr.addClass("shown");
          $(".shown").next().css("background-color", "#f5f5f5");
        }
		
      });
      function format(d) {
        // `d` is the original data object for the row
        return (
          '<table id="detailcondo" class="table table-no-bordered table-hover" cellspacing="0" width="100%" style="width:100%">' +
          "<thead>" +
          "<tr>" +
          "<td>Invoice#</td>" +
          "<td>PO Amount</td>" +
          "<td>Invoice Amount</td>" +
          "<td>Purchase Order Date</td>" +
          "<td>Invoice Due Date</td>" +
          "<td>Paid Date</td>" +
          "</tr>" +
          "</thead>" +
          "</table>"
        );
      }
      
      //
    },
    
  };


let createDataTables = {
    createTable: function (id, dataSet, filterObject, buttonElements) {
      var createFiltersOptions = this.createFiltersOptions;
      var createFilters = this.createFilters;
      var createResetButton = this.createResetButton;
      var createResetButtonAction = this.createResetButtonAction;
      let column = [];
      if (dataSet.valueRow[0] != 0) {
        column.push({
          className: "text-right",
          targets: dataSet.valueRow,
        });
      }
      column.push({
        className: "text-center",
        targets: ["_all"],
      });
      column.push({
        // width: "8%",
        tooltip: "abc",
        targets: ["_all"],
      });
      console.log(column, "column");
      row =
        "rowsGroup" in dataSet
          ? {
              pageLength: 10,
              processing: true,
              data: dataSet.data,
              rowsGroup: dataSet.rowsGroup,
              order: [[4, "desc"]],
              columns: dataSet.columns,
              tooltip: true,
              tooltip: dataSet.columns.tooltip,
              // columnDefs: dataSet.columnDefs,
              pagingType: "full_numbers",
              lengthMenu: [
                [10, 25, 50, -1],
                [10, 25, 50, "All"],
              ],
              aaSorting: [],
              responsive: true,
              language: {
                search: "_INPUT_",
                searchPlaceholder: "Search records",
                sLengthMenu: "Number of entries _MENU_",
              },
              columnDefs: column,
  
              initComplete: function () {
                api = this.api();
                createFilters(buttonElements.filterId, filterObject);
                createResetButton(buttonElements);
                createFiltersOptions(filterObject, api);
                createResetButtonAction(
                  buttonElements.className,
                  buttonElements.select,
                  filterObject,
                  api
                );
                if ("fun" in dataSet) {
                  init();
                }
              },
            }
          : {
              autoWidth: false,
              pageLength: 10,
              processing: true,
              data: dataSet.data,
              //rowsGroup:row,
              columns: dataSet.columns,
              tooltip: true,
              tooltip: "dataSet.tooltip",
              // columnDefs: dataSet.columnDefs,
              pagingType: "full_numbers",
              lengthMenu: [
                [10, 25, 50, -1],
                [10, 25, 50, "All"],
              ],
              aaSorting: [],
              // responsive: true,
              fixedColumns: true,
              language: {
                search: "_INPUT_",
                searchPlaceholder: "Search records",
                sLengthMenu: "Number of entries _MENU_",
              },
              columnDefs: column,
  
              initComplete: function () {
                api = this.api();
                createFilters(buttonElements.filterId, filterObject);
                createResetButton(buttonElements);
                createFiltersOptions(filterObject, api);
                createResetButtonAction(
                  buttonElements.className,
                  buttonElements.select,
                  filterObject,
                  api
                );
                if ("fun" in dataSet) {
                  init();
                }
              },
            };
  
      return $(id).DataTable(row);
    },
  
    createFilters: function (id, filterObject) {
      filterObject.forEach((element) => {
        $(id).append(
          '<select id="' +
            element.id +
            '" class="selectpicker ' +
            element.className +
            '"' +
            'data-live-search="true" title="' +
            element.title +
            '"></select>'
        );
      });
      $(".selectpicker").selectpicker("refresh");
    },
  
    createFiltersOptions: function (elements, api) {
      console.log(elements, "test2");
      elements.forEach(function (ele) {
        var column = api.columns(ele.number);
        var id = "#" + ele.id;
        $(id).append('<option value="">Reset</option>');
        // addResetFunction(column, '#open-proposal_reset', '.open-proposal_select')
        column
          .data(0)
          .eq(0)
          .unique()
          .sort()
          .each(function (d, j) {
            $(id).append('<option value="' + d + '">' + d + "</option>");
  
            $(id).on("change", function () {
              var val = $.fn.dataTable.util.escapeRegex($(this).val());
              column.search(val ? "^" + val + "$" : "", true, false).draw();
            });
          });
      });
      $(".selectpicker").selectpicker("refresh");
    },
    createResetButton: function (element) {
      $(element.filterId).append(
        '<button type="reset" class="' +
          element.className +
          ' btn btn-warning reset">' +
          "Reset</button>"
      );
    },
    createResetButtonAction: function (buttonClass, select, filterObject, table) {
      $("." + buttonClass).click(function () {
        $("." + select).val("");
        $("." + select).selectpicker("refresh");
        filterObject.forEach(function (ele) {
          table.columns(ele.number).search("").draw();
        });
        $(this).blur();
      });
    },
  };


function after_click(resultin){
var condomanagerdata=[]
for(i=0;i<resultin['message'].length;i++){

	condomanagerdata.push(
            {"invoice":resultin['message'][i][0], "poamount":resultin['message'][i][1], "invamount":resultin['message'][i][2], "purchaseorderdate":resultin['message'][i][3], "invoiceduedate":resultin['message'][i][4], "paiddate":resultin['message'][i][5] },
            )
	
}

        elementArray = [
          {
            id: "condodetail-title",
            title: "Inv",
            number: 0,
            className: "col-md-3 condodetail-select",
          },
        ];
        dataSet = {
          data:condomanagerdata,
          columns: [
  
            {
              data: "invoice",
            },
            {
              data: "poamount",
            },
            {
              data: "invamount",
            },
            {
              data: "purchaseorderdate",
            },
            {
              data: "invoiceduedate",
            },
            {
              data: "paiddate",
            },
          ],
          valueRow: [5],
        };
        buttonElements = {
          id: "condodetail-reset",
          filterId: "#detailcondo_filter",
          className: "condodetail-reset",
          select: "condodetail-select",
        };
  
        // console.log(dataSet1,'testing')
        createDataTables.createTable(
          "#detailcondo",
          dataSet,
          elementArray,
          buttonElements
        );
}

 $("#btnGet").click(function () {
		$("#condotable input[type=checkbox]:checked").each(function () {
			var row = $(this).closest("tr")[0];
        var invoice = $(this).parent().siblings('.invoice').text();
	var xhttp;
          xhttp=new XMLHttpRequest();
	  var result_in;
           xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                //callBack(this);
            }
          };
          xhttp.open('GET','/api/method/seabridge_app.seabridge_app.api.web_form?doc='+invoice,true);
          xhttp.send();
		})
	window.location.reload();
	})

 $("#btnApprove").click(function () {
		$("#condotable input[type=checkbox]:checked").each(function () {
			var row = $(this).closest("tr")[0];
        var invoice = $(this).parent().siblings('.invoice').text();
	var xhttp;
          xhttp=new XMLHttpRequest();
	  var result_in;
           xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                //callBack(this);
            }
          };
          xhttp.open('GET','/api/method/seabridge_app.seabridge_app.api.approve_invoice?doc='+invoice,true);
          xhttp.send();
		})
	
	
	})

 $("#btnReject").click(function () {
		$("#condotable input[type=checkbox]:checked").each(function () {
			var row = $(this).closest("tr")[0];
        var invoice = $(this).parent().siblings('.invoice').text();
	var xhttp;
          xhttp=new XMLHttpRequest();
	  var result_in;
           xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                //callBack(this);
            }
          };
          xhttp.open('GET','/api/method/seabridge_app.seabridge_app.api.reject_invoice?doc='+invoice,true);
          xhttp.send();
		})
	
	})

$("#checkval").click( function(){
//$("#checkval" ).on( "click", function() {
	console.log("check------------")
})





}
