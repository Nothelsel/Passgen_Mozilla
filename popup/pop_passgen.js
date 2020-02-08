

var check_symbols = document.getElementById('symbols');
var check_numbers = document.getElementById('numbers');
var gener = document.getElementById('generate');
var len_password = document.getElementById('len_pass');
var zonetext = document.getElementById('zonetext');
var genbutt = document.getElementById('generate');
var output = document.getElementById("screen_len");
output.innerHTML = len_password.value;

len_password.oninput = function() {
  output.innerHTML = this.value;
}


// permet de mettre le texte dans zonetext
document.getElementById("generate").addEventListener("click", function() {
  document.getElementById("zonetext").value = Password.generate(output.value);
});

document.getElementById("copy").addEventListener("click", function(){
  zonetext.select();
  document.execCommand("copy");
  alert("Text Copied !");
})

var Password = {

  _pattern : /[a-zA-Z0-9_$%ù()=\-+.*!:]/,


  _getRandomByte : function()
  {
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
