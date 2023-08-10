var videoid = [];
var current = 0;
var temp=0;
// document.getElementById('dir').value=__dirname;
const { ipcRenderer } = require('electron');

function test(){
    if (temp==0){
        document.getElementById('dir').value=__dirname;
        temp=1;
    }

}
// renderer javascript file
function saveFile() {
    ipcRenderer.send('show-save-dialog');
    
}

ipcRenderer.on('save-file-path', (event, filePath) => {
    console.log(filePath);
    document.getElementById('dir').value=filePath;
    /*
        you should complete this code here you have the url
    */
});

// listens to the server to finish download current song
ipcRenderer.on('downloadFinished', function (evt) {
    console.log("download finished!");
    // make loading indicator invisible, and buttons visible
    document.getElementById('dIndicator').style.visibility = 'hidden';
    document.getElementById('ButtonDiv').style.visibility = 'visible';
});

// downloading song function
function download() {
    // makes the buttons invisible, and the loading indicator visible
    document.getElementById('dIndicator').style.visibility = 'visible';
    document.getElementById('ButtonDiv').style.visibility = 'hidden';
    
    downloadData = {
        dLink: document.getElementById('link').src,
        dName: document.getElementById("name").src,
        dDir:document.getElementById("dir").value
    }

    // making the main.js file download the song
    ipcRenderer.send('download-function', downloadData);
};

function forward(){
    document.getElementById('btn_left').style.visibility = 'visible';
    current++;
    document.getElementById('link').src = 'https://www.youtube.com/embed/'+videoid[current];
    document.getElementById("current").innerText = current+1;
    if(current==videoid.length-1){ document.getElementById('btn_right').style.visibility = 'hidden';}
}
function backward(){
    document.getElementById('btn_right').style.visibility = 'visible';
    document.getElementById("current").innerText = current;
    current--;
    document.getElementById('link').src = 'https://www.youtube.com/embed/'+videoid[current];
    if(current==0){ document.getElementById('btn_left').style.visibility = 'hidden';}
}

function search() {
    let name = document.getElementById("name").value;
    preformer = document.getElementById("performer").value;
    if(name != "" || preformer!=""){
        console.log("hello " + name + " by " + preformer);
        fetch('https://www.googleapis.com/youtube/v3/search?key=AIzaSyBHPmSqU2GLZKYh4fRxK-wvo84_4c-UdEQ&type=video&part=snippet&q=' + name + " " + preformer)
        .then(res =>{
            return res.json();
        })
        .then(data=>{
            sum = 0;
            data.items.forEach((curr)=>{
                videoid[sum]=(curr.id.videoId);
                sum++;
            })
            current=0;
            console.log('https://www.youtube.com/embed/' + videoid[0]);
            document.getElementById('link').src = 'https://www.youtube.com/embed/' + videoid[0];
            document.getElementById("total").innerText = sum;
            
            if(sum>1){
                document.getElementById('btn_right').style.visibility = 'visible';
            }
        })
    }
}
