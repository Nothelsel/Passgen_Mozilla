const check_numbers = document.getElementById('numbers');
const check_symbols = document.getElementById('symbols');
const gener = document.getElementById('generate');
const len_password = document.getElementById('len_pass');
const zonetext = document.getElementById('zonetext');
const genbutt = document.getElementById('generate');
const copybutt = document.getElementById('copy');
const output = document.getElementById("screen_len");


let pattern = /[a-hjkm-zA-HJKM-Z]/
let Password = {
  _pattern : pattern,
  
  _getRandomByte : function(){
    if(window.crypto && window.crypto.getRandomValues){
      const result = new Uint8Array(1);
      window.crypto.getRandomValues(result);
      return result[0];
    }else if(window.msCrypto && window.msCrypto.getRandomValues){
      const result = new Uint8Array(1);
      window.msCrypto.getRandomValues(result);
      return result[0];
    }else{
      return Math.floor(Math.random() * 256);
    }
  },

  generate : function(length){
    return Array.apply(null, {'length': length})
      .map(function(){
        let result;
        while(true){
          result = String.fromCharCode(this._getRandomByte());
          if(this._pattern.test(result)){
            let data = readStorage('history');
            data.then(async (res) => {
              console.log(res);
              if(res.passwords){
                let date = new Date();
                const tmp = {
                  "date": date,
                  "password": result
                }
                res.passwords.push(tmp);
                writeStorage('history', res);
              }else{
                await createStorage('history');
                let date = new Date();
                const tmp = {
                  "date": date,
                  "password": result
                }
                res.passwords.push(tmp);
                writeStorage('history', res);
              }
            })
            return result;
          }
        }
      }, this)
      .join('');
  }
};

function setDefault() {
  let regxp = Password._pattern.source.replace('[','').replace(']','')
  regxp = regxp + '_$%ù()=\\-+.*!:'
  regxp = regxp + '0-9'
  Password._pattern = new RegExp(`[${regxp}]`)
  document.getElementById('symbols').checked = true;
  document.getElementById('numbers').checked = true;
  document.getElementById("zonetext").value = Password.generate(output.value);
}

async function createStorage(name) {
  await browser.storage.local.set({[name]: {passwords: []}});
}

async function readStorage(name){
  checkExistStorage(name);
  let storageItem = await browser.storage.local.get(name);
  return storageItem
}

function writeStorage(name, data){
  browser.storage.local.set({[name]: data});
}

function checkExistStorage(name){
  browser.storage.local.get(name).then(async (res) => {
    if(res[name] == undefined){
      await createStorage(name);
    }
  })
}


function processData(data) {
  let tmp = ""
  for(let i = 0; i < data.length; i++) {
    tmp += `
    <div class="card mt-1">
      <div class="card-body">
       <div class="row">
        <div class="col">
         <p class="card-text">${data[i].date}</p>
        </div>
        <div class="col">
          <p class="card-text">${data[i].password}</p>
        </div>
       </div>
      </div>
    </div>
    `
  }
  return tmp;
}


function init(){
  output.innerHTML = len_password.value;
  len_password.oninput = function() {
    output.innerHTML = this.value;
  }
  
  len_password.onchange = function () {
    document.getElementById("zonetext").value = Password.generate(output.value);
  }
  
  document.getElementById("generate").addEventListener("click", function() {
    document.getElementById("zonetext").value = Password.generate(output.value);
    genbutt.textContent = "GEN ✅";
    setTimeout(() => {
      genbutt.textContent = "GEN 🔑";
    }, 2000);
  });
  
  document.getElementById("copy").addEventListener("click", function(){
    zonetext.select();
    document.execCommand("copy");
    copybutt.textContent = "Copied!";
  })

  document.getElementById("configBtn").addEventListener("click", function(){
    if(document.getElementById("modalConf").innerHTML != ""){
      document.getElementById("modalConf").innerHTML = ``;
      return;
    }else{
      document.getElementById("modalConf").innerHTML = `
      <div class="modal-content customModal">
        <h5 class="modal-title mt-2">Configuration ⚙️</h5>
        <div class="modal-body">
        <label>Conservation de l'historique :
          <select class="form-select timeHistory mt-1" name="timeHistory">
            <option selected value="1"> 1 jour</option>
            <option value="30">30 jours</option>
            <option value="90">90 jours</option>
          </select>
        </label>
        </div>
      </div>
      `
    }
  })


  document.getElementById("historyBtn").addEventListener("click", function(){
    if(document.getElementById("modalConf").innerHTML != ""){
      document.getElementById("modalConf").innerHTML = ``;
      return;
    }else{
      const data = readStorage('history');
      console.log(data);
      data.then((res) => {
        const processedData = processData(res);
        document.getElementById("modalConf").innerHTML = `
        <div class="modal-content customModal">
        <h5 class="modal-title mt-2">Historiques 📁</h5>
          <div class="modal-body">
            ${processedData}
          </div>
        </div>
      `
      })
      }
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

  setDefault()
}

window.addEventListener("load", init, false);
