let currentsong = new Audio();
let folder;
let songlist;
async function getfolder(url) {
  let folder_url = await fetch(url);
  let response = await folder_url.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let folders = [];
  for (let index = 0; index < anchors.length; index++) {
    const element = anchors[index];
    if (element.href.endsWith(".mp3")) {
      // console.log(element.href)
      // console.log('anyother file');
    } else {
      let filter = element.href.split("songs/")[1];
      if (typeof filter === "undefined") {
        // console.log("undefined value", filter);
      } else {
        folders.push(filter.replace("/", ""));
      }
    }
  }
  return folders;
}
async function getsongs(url) {
  let songs_url = await fetch(url);
  // console.log(songs_url.url);

  let response = await songs_url.text();

  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");

  let songs = [];
  for (let index = 0; index < anchors.length; index++) {
    const element = anchors[index];
    if (element.href.endsWith(".mp3")) {
      // console.log(element.href.split('songs/')[1]);
      songs.push(element.href.split("songs/")[1]);
    }
  }
  // console.log(songs);

  return songs;
}
function convertMilliseconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}
function changemusic_logo(track) {
  // First, clear all music logos to the default state
  Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach((e) => {
    if (e.querySelector(".songurlname").innerHTML == track) {
      // Set the volume icon if it matches the current track
      e.querySelector(".music_logo > img").src = "assets/Nt6v.gif";
      e.querySelector(".music_logo > img").style.height = "25px";
    }
     else {
      // Otherwise, reset to the default music icon
      e.querySelector(".music_logo > img").src = "assets/music_logo.svg";
    }
    
  });

  // Set up the play button event listener to change icons correctly
  play.addEventListener("click", () => {
   
      // Check the song's play/pause state and update the icon accordingly
      let arr = Array.from(document.querySelectorAll(".songurlname"))
      for (const b of arr) {
        if (b.innerHTML == track && currentsong.paused){b.parentElement.querySelector(".music_logo > img").src = "assets/music_logo.svg"}
        else if (b.innerHTML == track && currentsong.src.includes(track)) {
          b.parentElement.querySelector(".music_logo > img").src = "assets/Nt6v.gif"
        }
        // else if(currentsong.currentTime == currentsong.duration){
        //   b.querySelector(".music_logo > img").src = "assets/music_logo.svg"
        // }
      }
    });

  }

const playmusic = (track) => {
  
  currentsong.src = `./songs/${track}`;
  currentsong.play();
  changemusic_logo(track);
  play.src = "assets/pause.svg";
};
function clean_songname(song, folder_name) {
  let clean_name = song
  .replaceAll("%20", " ")
  .replaceAll(`${folder_name}/`, "")
    .replaceAll("128-", "")
    .replaceAll("Kbps", "")
    .replaceAll("128", "")
    .replaceAll(".mp3", "")
    if (clean_name.length>=25){ clean_name = clean_name.slice(0,24) + "..."} 
  return clean_name;
}
function playmusicfromlibrarrybtn() {
//  console.log(document.querySelector(".songlist"));
  
  Array.from(
    document.querySelector(".songlist").getElementsByTagName("li")
  ).forEach((e) => {
    // console.log(e);
    
    let music_play = e.querySelector(".music_playbtn");
    // console.log(music_play);   
      music_play.addEventListener("click", () => {
        // console.log('clicked');
        // console.log(document.querySelector(".music_logo > img").src);
        // e.querySelector(".music_logo > img ").src = document.querySelector(".music_logo > img ").src.replace("music_logo.svg", "volume.svg")
        
      console.log(e.querySelector(".songname").innerHTML);

      document.querySelector(".trackname").innerHTML =
        e.querySelector(".songname").innerHTML;
      e = e.querySelector(".songurlname").innerHTML;
      // console.log(e);
      playmusic(e);
    });
  })
}

async function main() {
  let all_folders = await getfolder("./songs/");
  
  if (all_folders){
  for (folder of all_folders) {
    if (folder){
    let a = await fetch(`./songs/${folder}/info.json`)
    let info = await a.json()
    console.log(info.title);
    
    
    let carddiv = document.createElement("div");
    carddiv.classList.add("card");
    carddiv.innerHTML = `
            <div class="playbutton">
              <svg
                width="50"
                height="50"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="#1E90FF" />
                <polygon points="9,6 9,18 17,12" fill="black" />
              </svg>
            </div>
            <img
              src="songs/${folder}/cover.png"
              alt="image"
            />
            <h3 class = "folder">${folder}</h3>
            <h3 class = "title">${info.title}</h3>
            <p>${info.description}</p>
          `;
    document.querySelector(".card_container").appendChild(carddiv);
  }
}
}
  // load New folder in library on playbutton click
  for (load of Array.from(document.querySelectorAll(".playbutton"))){
    load.addEventListener('click',async function(e) {
      let parent = (e.currentTarget.parentElement);
      folder = parent.getElementsByTagName('h3')[0].innerText
      songlist = await getsongs(`./songs/${folder}`);

  let songUL = document
    .querySelector(".songlist")
    .getElementsByTagName("ul")[0];
    songUL.innerHTML = "";
  // playing the first song
  playmusic(songlist[0])
  document.querySelector(".trackname").innerHTML = clean_songname(currentsong.src.split("songs/")[1], folder)
  for (let song of songlist) {
    songurlname = song;
    // folder = songurlname.split("/")[0];
    // console.log(folder);

    song = clean_songname(song, `${folder}`);
    // song = song
    //   .replaceAll("%20", "")
    //   .replaceAll("128-", "")
    //   .replaceAll("Kbps", "")
    //   .replaceAll("128", "")
    //   .replaceAll(".mp3", "");
    songUL.innerHTML = 
      songUL.innerHTML +
      `<li>
                <span class = "music_logo"><img src="assets/music_logo.svg" alt="logo"></span>
                <span class = "songname">${song}</span>
                <span class = "songurlname">${songurlname}</span>
                <span class = "foldername">${folder}</span>
                <span class = "music_playbtn"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" color="#ffffff" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" />
                  <path d="M9.5 11.1998V12.8002C9.5 14.3195 9.5 15.0791 9.95576 15.3862C10.4115 15.6932 11.0348 15.3535 12.2815 14.6741L13.7497 13.8738C15.2499 13.0562 16 12.6474 16 12C16 11.3526 15.2499 10.9438 13.7497 10.1262L12.2815 9.32594C11.0348 8.6465 10.4115 8.30678 9.95576 8.61382C9.5 8.92086 9.5 9.6805 9.5 11.1998Z" fill="currentColor" />
              </svg></span>
              </li>`;
  }
  playmusicfromlibrarrybtn();
    })
  }

    // play/Pause songs from bar
  play.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      play.src = "assets/pause.svg";
    } else {
      currentsong.pause();
      play.src = "assets/play.svg";
    }
  });

  // update time duration
  // console.log(document.querySelector(".duration"));
  currentsong.addEventListener("timeupdate", () => {
    document.querySelector(".duration").innerHTML = `${convertMilliseconds(
      currentsong.currentTime
    )} / ${convertMilliseconds(currentsong.duration)}`;
    // update progress bar
    const progress = (currentsong.currentTime / currentsong.duration) * 100;
    document.documentElement.style.setProperty(
      "--progress_bar-width",
      `${progress}%`
    );
    // console.log(currentsong.src.split('songs/')[1]);
    if (currentsong.currentTime == currentsong.duration){
      let index = songlist.indexOf(currentsong.src.split('songs/')[1])
      index = index +1;
      if (index < songlist.length) {
        playmusic(songlist[index]);
        document.querySelector(".trackname").innerHTML = clean_songname(currentsong.src.split('songs/')[1], folder)
      }
    }
  });

  // adding click functionality in seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let clickchange =
      (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.documentElement.style.setProperty(
      "--progress_bar-width",
      `${clickchange}%`
    );
    currentsong.currentTime = (currentsong.duration * clickchange) / 100;
  });
  // functionating  hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".section_25").style.translate = "0%";
  });
  // addding closing menu functionality
  document.querySelector(".close").addEventListener("click", () => {
    // console.log('here');

    document.querySelector(".section_25").style.translate = "-324%";
  });
  // Adding functionality to previous button
    previous.addEventListener("click", () => {
    // console.log("src:",currentsong.src);

    let index = songlist.indexOf(currentsong.src.split("songs/")[1]);
    // console.log(index);
    

    if (index > 0) {
      index = index - 1;
      playmusic(songlist[index]);
      document.querySelector(".trackname").innerHTML = clean_songname(
        currentsong.src.split("songs/")[1],
        `${folder}`
      );
    }
  });
  // Adding functionality to next button
  next.addEventListener("click", () => {
    let index = songlist.indexOf(currentsong.src.split("songs/")[1]);
    index = index + 1;
    if (index < songlist.length) {
      playmusic(songlist[index]);
      document.querySelector(".trackname").innerHTML = clean_songname(
        currentsong.src.split("songs/")[1],
        `${folder}`
      );
    }
  });
  // Showing vol bar on hover
  document.querySelector(".vol").addEventListener("mouseenter", () => {
    document.querySelector(".range").style.width = "100%";
    setTimeout(() => {
      document.querySelector(".range").style.width = "0";
    }, 5000);
  });
  // Adding mute functionality
  document.querySelector(".vol > img").addEventListener("click", (e) => {
    // console.log(e.target.src.replace( "assets/volume.svg",'assets/mute.svg'));
    // console.log(e.target.src);
    
    
    if(e.target.src.includes("assets/volume.svg")){e.target.src = e.target.src.replace( "assets/volume.svg",'assets/mute.svg'); currentsong.volume = 0;
       document.querySelector(".volrange").value = 0}
    else{e.target.src = e.target.src.replace( "assets/mute.svg",'assets/volume.svg'); currentsong.volume = 0.5
      document.querySelector(".volrange").value = 50
    }
    
  });
  // Adding volume toggle functionality
  document.querySelector(".vol").addEventListener("change", () => {
    console.log(document.querySelector(".volrange").value);
    currentsong.volume = document.querySelector(".volrange").value / 100;
    if (currentsong.volume > 0){
      document.querySelector(".vol > img").src = document.querySelector(".vol > img").src.replace( "assets/mute.svg",'assets/volume.svg');
    }
    else if (currentsong.volume == 0){
      document.querySelector(".vol > img").src = document.querySelector(".vol > img").src.replace( "assets/volume.svg",'assets/mute.svg');
    }
  });
}

main();