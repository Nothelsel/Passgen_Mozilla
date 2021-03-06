var check_numbers = document.getElementById('numbers');
var check_symbols = document.getElementById('symbols');
var gener = document.getElementById('generate');
var len_password = document.getElementById('len_pass');
var zonetext = document.getElementById('zonetext');
var genbutt = document.getElementById('generate');
var output = document.getElementById("screen_len");
output.innerHTML = len_password.value;

let pattern = /[a-hjkm-zA-HJKM-Z]/

len_password.oninput = function() {
  output.innerHTML = this.value;
}

len_password.onchange = function () {
  document.getElementById("zonetext").value = Password.generate(output.value);
}

document.getElementById("generate").addEventListener("click", function() {
  document.getElementById("zonetext").value = Password.generate(output.value);
});

document.getElementById("copy").addEventListener("click", function(){
  zonetext.select();
  document.execCommand("copy");
  alert("Text Copied !");
})

check_symbols.addEventListener('change', function() {
  let temp = Password._pattern.source.replace('[','').replace(']','')
  if (this.checked) {
    temp = temp + '_$%ù()=\\-+.*!:'
    Password._pattern = new RegExp(`[${temp}]`)
  } else {
    temp = temp.split('_$%ù()=\\-+.*!:').join('')
    Password._pattern = new RegExp(`[${temp}]`)
  }
});

check_numbers.addEventListener('change', function() {
  let temp = Password._pattern.source.replace('[','').replace(']','')
  if (this.checked) {
    temp = temp + '0-9'
    Password._pattern = new RegExp(`[${temp}]`)
  } else {
    temp = temp.split('0-9').join('')
    Password._pattern = new RegExp(`[${temp}]`)
  }
});

let Password = {
  _pattern : pattern,
  
  _getRandomByte : function(){
    if(window.crypto && window.crypto.getRandomValues){
      var result = new Uint8Array(1);
      window.crypto.getRandomValues(result);
      return result[0];
    }else if(window.msCrypto && window.msCrypto.getRandomValues){
      var result = new Uint8Array(1);
      window.msCrypto.getRandomValues(result);
      return result[0];
    }else{
      return Math.floor(Math.random() * 256);
    }
  },

  generate : function(length){
    return Array.apply(null, {'length': length})
      .map(function(){
        var result;
        while(true){
          result = String.fromCharCode(this._getRandomByte());
          if(this._pattern.test(result)){
            return result;
          }
        }
      }, this)
      .join('');
  }
};

