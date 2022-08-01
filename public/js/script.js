
var url_value = document.getElementById("newurl").textContent;
document.getElementById('Copy').onclick = function(){
  console.log('Hello world',url_value);
  navigator.clipboard.writeText(url_value).then(() => {
    
  });
}
