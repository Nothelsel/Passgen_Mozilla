

var check_symbols = document.getElementById('symbols');
var check_numbers = document.getElementById('numbers');
var gener = document.getElementById('generate');
var number_password = document.getElementById('num_pass');
var zonetext = document.getElementById('zonetext');
var genbutt = document.getElementById('generate');









// permet de mettre text dans zonetext
document.getElementById("generate").addEventListener("click", function() {
  document.getElementById("zonetext").value = Password.generate(number_password.value);
});

// zonetext.addEventListener('text', function(e) {
//     e.target.value = "Vous avez le focus !";
// });
// password_generator(number_password);

var Password = {

  _pattern : /[a-zA-Z0-9_$%ù()=\-\+\.]/,


  _getRandomByte : function()
  {
    // http://caniuse.com/#feat=getrandomvalues
    if(window.crypto && window.crypto.getRandomValues)
    {
      var result = new Uint8Array(1);
      window.crypto.getRandomValues(result);
      return result[0];
    }
    else if(window.msCrypto && window.msCrypto.getRandomValues)
    {
      var result = new Uint8Array(1);
      window.msCrypto.getRandomValues(result);
      return result[0];
    }
    else
    {
      return Math.floor(Math.random() * 256);
    }
  },

  generate : function(length)
  {
    return Array.apply(null, {'length': length})
      .map(function()
      {
        var result;
        while(true)
        {
          result = String.fromCharCode(this._getRandomByte());
          if(this._pattern.test(result))
          {
            return result;
          }
        }
      }, this)
      .join('');
  }

};
