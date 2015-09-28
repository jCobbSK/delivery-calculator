function Calculator() {

  var CONSTANTS = {
    lateOrdersFraction: 0.3,
    lostCustomersFraction: 0.25,
    disappointedCustomersFraction: 0.5,
    OrderlordLateOrderLowerRate: 0.7,
    driversSaveFraction: 0.9,
    daysInMonth: 30
  }

  var usersData = {
    'calc-locations-number': 3,
    'calc-orders': 100,
    'calc-drivers': 6,
    'calc-driver-salary': 1200,
    'calc-manager-salary': 1800,
    'calc-order-per-customer': 15,
    'calc-late-orders': 30
  };

  var calculatedData = {};

  function updateUserData(key, value) {
    usersData[key] = value;
    recalculate();
  }

  function recalculate() {
    //calculation
    calculatedData = calculateData(usersData, CONSTANTS);

    refreshCalculatedData();
  }

  function refreshCalculatedData() {
    for (var key in calculatedData) {
      $('#'+key).empty().append(calculatedData[key]);
    }
  }

  function isChain(val) {
    if (val) {
      $('.chain-field').parent().show();
      $('#direct-labor-table').show();
    } else {
      $('.chain-field').parent().hide();
      $('#direct-labor-table').hide();
    }
  }

  function percentageFormat(float) {
    var value = Math.round(float * 100);
    return {
      formatted: value + '%',
      value: float
    }
  }

  function moneyFormat(float) {
    var value = parseFloat(float + '').toFixed(0);
    return {
      formatted: '£' + value,
      value: value
    }
  }

  function costTdFormat(perc, value) {
    return value;// + ' <br> <small>(' + perc + ')</small>';
  }

  /**
   * @constructor
   */
  (function init(){

    $('.field-calculator').on('keyup blur', function(){
      var id = $(this).attr('id'),
        value = $(this).val();

      if (id == 'calc-locations-number') {
        isChain(value > 1);
        $(this).removeClass('blinking-red');
      }

      updateUserData(id, value);
    });

    //init values of inputs
    for (var key in usersData) {
      $('#'+key).val(usersData[key]);
    }

    recalculate();
  })();

  function calculateData(user, constants) {
    var res = {},
      lateOrdersPerc = percentageFormat(user['calc-late-orders'] / user['calc-orders']),
      lateOrdersVal = moneyFormat(user['calc-late-orders'] * user['calc-order-per-customer']),
      lateOrdersPercOL = percentageFormat(user['calc-late-orders'] * constants.OrderlordLateOrderLowerRate / user['calc-orders']),
      lateOrdersValOL = moneyFormat(user['calc-late-orders'] * constants.OrderlordLateOrderLowerRate * user['calc-order-per-customer']),
      lostCustomers = percentageFormat(lateOrdersPerc.value * constants.lostCustomersFraction),
      lostCustomersVal = lostCustomers.value * user['calc-orders'],
      lostCustomersOL = percentageFormat(lateOrdersPercOL.value * constants.lostCustomersFraction),
      lostCustomersValOL = lostCustomersOL.value * user['calc-orders'],
      dissCustomers = percentageFormat(lateOrdersPerc.value * constants.disappointedCustomersFraction),
      dissCustomersVal = dissCustomers.value * user['calc-orders'],
      dissCustomersOL = percentageFormat(lateOrdersPercOL.value * constants.disappointedCustomersFraction),
      dissCustomersValOL = dissCustomersOL.value * user['calc-orders'],
      drivers = moneyFormat(user['calc-drivers'] * user['calc-driver-salary']),
      driversOL = moneyFormat(Math.ceil(user['calc-drivers'] * constants.driversSaveFraction) * user['calc-driver-salary']),
      managers = moneyFormat(user['calc-locations-number'] * user['calc-manager-salary']),
      managersOL = moneyFormat(user['calc-manager-salary']),
      valueOfDissapointedCustomer = user['calc-order-per-customer'],
      valueOfLostCustomer = user['calc-order-per-customer'] * 2;

    res['late-orders-wo'] = costTdFormat(lateOrdersPerc.formatted, lateOrdersVal.formatted);
    res['late-orders-w'] = costTdFormat(lateOrdersPercOL.formatted, lateOrdersValOL.formatted);
    res['lost-customers-wo'] = Math.round(lostCustomersVal);
    res['lost-customers-w'] = Math.round(lostCustomersValOL);
    res['disapointed-customers-wo'] = Math.round(dissCustomersVal),
    res['disapointed-customers-w'] = Math.round(dissCustomersValOL);
    res['drivers-wo'] = drivers.formatted;
    res['drivers-w'] = driversOL.formatted;
    res['managers-wo'] = managers.formatted;
    res['managers-w'] = managersOL.formatted;
    var lostRevenue = moneyFormat(constants.daysInMonth * (valueOfDissapointedCustomer * res['disapointed-customers-wo'] + valueOfLostCustomer * res['lost-customers-wo']));
    res['lost-revenue'] = lostRevenue.formatted + ' /month';
    res['improvement-value'] = moneyFormat(lostRevenue.value - constants.daysInMonth * (valueOfDissapointedCustomer * res['disapointed-customers-w'] + valueOfLostCustomer * res['lost-customers-w']));
    if (user['calc-locations-number'] > 1) {
      var salariesImprovement = (drivers.value - driversOL.value) + (managers.value - managersOL.value);
      res['improvement-value'] = res['improvement-value'].formatted + ' + ' + moneyFormat(salariesImprovement).formatted + ' /month';
    } else {
      res['improvement-value'] = res['improvement-value'].formatted + ' /month';
    }

    return res;
  }
}

/**
 * Setup all scroll hooks.
 */
function scrollsInit() {
  $('.scroll-to').on('click', function(){
    var scrollToElement = $(this).data('scroll-element');
    $(document).scrollTo($(scrollToElement)[0], {
      duration: 500
    });
  });
}

/**
 * Main initialization
 */
function initialize() {
  scrollsInit();
  Calculator();
}

function checkCode(callback) {
  $.ajax({
    method: 'GET',
    url: '/check_code',
    data: {
      code: $('#redeem-code').val()
    },
    success: function(data) {
      callback(false, data);
    },
    error: function(){
      callback(true);
    }
  });
}

$(document).ready(function(){
  initialize();

  $('#sheit-submit').on('click', function(){
    $('#sheit').hide();
    $('#thanks').show();
    return true;
  });

  $('#redeem-submit').on('click', function(){
    checkCode(function(err, result){
      if (!err && result.success) {
        $('#redeem').submit();
        $('#redeem').hide();
        $('#redeem-thanks').show();
      } else {
        alert('invalid code');
      }
    });
  });
});
