/* Legend of Corn — experimental boss/arena art pass.
   Runs inside a same-origin preview iframe. No save, combat, or navigation modifications.
   Art uses original coordinates and renders inside the original canvas. */
(function () {
  "use strict";
  if (window.__cornBossArtPreview || typeof drawBigEnemy !== "function" ||
      typeof drawInterior !== "function" || typeof drawBoss !== "function") return;
  window.__cornBossArtPreview = true;
  var baseFloor = drawInterior, baseBig = drawBigEnemy, baseFinal = drawBoss;
  var colors = [
    ["#ffcc67","#8c421e"], ["#69d5a7","#235b4c"], ["#cbec70","#456a1d"],
    ["#ffc46e","#995024"], ["#b4a3f4","#524078"], ["#a57ae0","#372b5a"],
    ["#9ee8ff","#315b82"], ["#a2bbff","#304270"], ["#ffe18b","#9c4c1f"]
  ];
  function box(x,y,w,h,c){ ctx.fillStyle=c;ctx.fillRect(x,y,w,h); }
  function circle(x,y,r,c){ctx.fillStyle=c;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();}
  function line(x1,y1,x2,y2,c,w){
    ctx.strokeStyle=c;ctx.lineWidth=w||2;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();
  }
  function ring(x,y,r,c,w){
    ctx.strokeStyle=c;ctx.lineWidth=w||2;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.stroke();
  }
  function poly(points,c){
    ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(points[0][0],points[0][1]);
    for(var i=1;i<points.length;i++)ctx.lineTo(points[i][0],points[i][1]);
    ctx.closePath();ctx.fill();
  }
  function star(x,y,r,color){
    ctx.save();ctx.translate(x,y);ctx.rotate(Math.PI/4);
    box(-r/6,-r/2,r/3,r,color);box(-r/2,-r/6,r,r/3,color);ctx.restore();
  }
  function safe(fn){ctx.save();try {fn();}finally{ctx.restore();}}
  function motif(id,cx,cy,k){
    var t=runTime||0, a=t*0.6+k;
    for(var n=0;n<8;n++){
      var th=n*Math.PI/4+a*0.13, dist=115+(n%2)*11;
      circle(cx+Math.cos(th)*dist,cy+Math.sin(th)*dist,2.8,k%2?"#fff4ba":"#ffffff");
    }
    if(id===5){
      for(var j=-2;j<=2;j++){
        line(cx-120,cy+j*19,cx+120,cy-j*19,"rgba(193,163,242,.28)",1);
      }
    }
    if(id===6 || id===2){
      for(var h=-1;h<=1;h++){
        line(cx-150,cy+h*38,cx+150,cy+h*38,"rgba(255,217,88,.19)",3);
      }
    }
  }
  drawInterior=function(){
    baseFloor.apply(this,arguments);
    if(state.mode!=="dungeon" || state.screen!=="play" ||
       dunRoom!==dunBossRoom(state.level)) return;
    safe(function(){
      var id=Math.min(8,Math.max(0,state.level|0)), co=colors[id];
      var cx=W/2,cy=H/2+6, pulse=0.5+0.5*Math.sin((runTime||0)*2.6);
      // Decorative underlay only: no new collisions, hitboxes, or hazards.
      ctx.globalAlpha=0.20;
      circle(cx,cy,167,co[1]);
      ctx.globalAlpha=0.65;
      ring(cx,cy,165,co[1],7);
      ring(cx,cy,150,co[0],3);
      ring(cx,cy,116,co[0],2);
      for(var n=0;n<12;n++){
        var ang=n*Math.PI/6;
        circle(cx+Math.cos(ang)*146,cy+Math.sin(ang)*146,6,co[1]);
        circle(cx+Math.cos(ang)*146,cy+Math.sin(ang)*146,2.5,co[0]);
      }
      motif(id,cx,cy,id);
      var emblems=["FEATHER","SHELL","IRON","HARVEST","MOON","WEB","STEEL","TWINS","CROWN"];
      box(cx-74,25,148,24,"rgba(12,15,17,.78)");
      ctx.strokeStyle=co[0];ctx.lineWidth=2;ctx.strokeRect(cx-74,25,148,24);
      ctx.textAlign="center";ctx.textBaseline="middle";
      ctx.font='10px "Press Start 2P",monospace';ctx.fillStyle=co[0];
      ctx.fillText(emblems[id]+" HALL",cx,37);
      ctx.globalAlpha=.4+.22*pulse;
      for(var p=0;p<4;p++){
        var px=p%2?W-96:96,py=p<2?100:H-96;
        circle(px,py,10,co[0]);
        star(px,py,16,"#fff0b0");
      }
    });
  };
  function aura(e,c){
    var x=e.x+e.w/2,y=e.y+e.h/2,t=runTime||0;
    ctx.globalAlpha=.22;
    ring(x,y,Math.max(e.w,e.h)*.59+12+Math.sin(t*3)*4,c,5);
    ring(x,y,Math.max(e.w,e.h)*.75+10,c,1.5);
    ctx.globalAlpha=.8;
    for(var i=0;i<5;i++){
      var a=i*Math.PI*2/5+t*.75;
      star(x+Math.cos(a)*(e.w*.65+15),y+Math.sin(a)*(e.h*.62+9),6,c);
    }
  }
  function crest(e){
    var x=e.x+e.w/2,y=e.y,w=e.w,h=e.h,t=runTime||0;
    switch(e.kind){
      case "chicken":
        // Extra layered feathers, scarlet war-plumes and glinting talons.
        for(var i=-2;i<=2;i++){
          poly([[x+i*8,y+7],[x+i*8-6,y-21-Math.sin(t*4+i)*4],[x+i*8+7,y+9]],i%2?"#c9302e":"#ff6643");
        }
        for(var a=-1;a<=1;a+=2)for(var j=0;j<3;j++){
          poly([[x+a*31,y+22+j*9],[x+a*(72+j*7),y+4+j*17],[x+a*32,y+31+j*9]],j%2?"#f9efe6":"#cbd0d2");
        }
        break;
      case "turtle":
        // Crown of shell spines plus segmented shell crest.
        for(var k=-3;k<=3;k++){
          var xx=x+k*12;
          poly([[xx-8,y+20],[xx,y-8-Math.abs(k)*2],[xx+8,y+20]],k%2?"#315e45":"#91c970");
        }
        ring(x,y+h*.48,w*.40,"#d7e69b",4);
        break;
      case "tractor":case "supertractor":
        // Chimneys, strobes, steel bolts and exhaust.
        for(var q=-1;q<=1;q+=2){
          box(x+q*w*.31-6,y-20,12,27,"#383d43");
          box(x+q*w*.31-9,y-25,18,6,"#b9c4c7");
          circle(x+q*w*.31,y-30-Math.sin(t*2+q)*7,8,"rgba(209,220,224,.35)");
        }
        for(var z=-2;z<=2;z++)circle(x+z*13,y+h*.52,3,"#ffd47a");
        break;
      case "wife":
        // Witchlike harvest bonnet; keep original character and attack animation.
        poly([[x-27,y+8],[x,y-33],[x+27,y+8]],"#7f4e96");
        box(x-31,y+5,62,7,"#e8ac64");
        star(x,y-11,12,"#ffe6a0");
        break;
      case "owl":
        for(var b=-2;b<=2;b++){
          poly([[x+b*10,y+9],[x+b*11-8,y-24-Math.sin(t*3+b)*3],[x+b*10+10,y+10]],b%2?"#d7b077":"#e8cf9a");
        }
        ring(x-12,y+18,10,"#fdf1b3",2);ring(x+12,y+18,10,"#fdf1b3",2);
        break;
      case "spider":
        for(var l=-3;l<=3;l++){
          line(x-26,y+12+l*3,x-69,y-20+l*17,"#b784f5",2);
          line(x+26,y+12+l*3,x+69,y-20+l*17,"#b784f5",2);
        }
        for(var v=-1;v<=1;v++)star(x+v*15,y+31,9,"#ff4e7a");
        break;
      case "farmer":
        // Embossed fork-head and bright scarf.
        poly([[x-14,y+29],[x+14,y+29],[x+4,y+43],[x-4,y+43]],"#f5bb47");
        for(var f=-1;f<=1;f++)box(x+26+f*6,y-22,3,18,"#ddeaf0");
        break;
    }
  }
  drawBigEnemy=function(e){
    baseBig.apply(this,arguments);
    if(!e || !e.big) return;
    safe(function(){
      var id=(state.level|0),co=colors[Math.max(0,Math.min(8,id))];
      aura(e,co[0]);crest(e);
      if(e.state==="aim" || e.state==="charge"){
        ctx.globalAlpha=.8;
        ring(e.x+e.w/2,e.y+e.h/2,Math.max(e.w,e.h)*.7+12,"#ffb94a",3);
        star(e.x+e.w/2,e.y-32,16,"#fff0a0");
      }
      if(e.hitT>0.12){
        ctx.globalAlpha=.5;box(e.x-5,e.y-5,e.w+10,e.h+10,"#fff5b0");
      }
    });
  };
  drawBoss=function(b){
    baseFinal.apply(this,arguments);
    if(!b)return;
    safe(function(){
      var x=b.x+b.w/2,y=b.y,t=runTime||0;
      aura(b,"#ffd95e");
      // Final king receives an independent silhouette pass.
      for(var i=-3;i<=3;i++){
        poly([[x+i*9,y-16],[x+i*9-6,y-40-(i%2?8:0)],[x+i*9+6,y-15]],i%2?"#f3ac28":"#ffe47b");
      }
      for(var j=-1;j<=1;j+=2){
        poly([[x+j*18,y+18],[x+j*50,y+4+Math.sin(t*5+j)*5],[x+j*34,y+65]],"#367b31");
        line(x+j*28,y+20,x+j*46,y+44,"#99dc67",3);
      }
      ring(x,y+22,24,"#fff1a0",2);
      star(x,y-43,13,"#fff7d0");
      if(b.dashT>0)for(var k=0;k<4;k++)star(x+(k-1.5)*22,y+76+k%2*9,11,"#ffe16a");
    });
  };
  console.info("[Legend of Corn] Boss art preview loaded (visual changes only)");
})();