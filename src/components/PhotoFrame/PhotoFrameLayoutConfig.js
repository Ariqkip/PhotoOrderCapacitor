const canvasWidth = 900;
const canvasHeight = 300;

const example1_broke = {
  frame: "frame1.png",
  layers: [
    {
       x: 35,
       y: 15,
       width: 160,
       height: 100,
       clipX: 0,
       clipY: 0,
       clipWidth: canvasWidth/5,
       clipHeight: canvasHeight
    },
    {
       x: 450,
       y: 90,
       width: 400,
       height: 100,
       clipX: 0,
       clipY: 0,
       clipWidth: 2*canvasWidth/3,
       clipHeight: canvasHeight
    },
  ]
};

const example1 = {
  frame: "frame1.png",
  layers: [
    {
       x: 35,
       y: 15,
       width: 160,
       height: 100,
       clipX: 0,
       clipY: 0,
       clipWidth: canvasWidth/3,
       clipHeight: canvasHeight
    },
    {
       x: 220,
       y: 15,
       width: 160,
       height: 100,
       clipX: 0,
       clipY: 0,
       clipWidth: 2*canvasWidth/3,
       clipHeight: canvasHeight
    },
    {
       x: 450,
       y: 90,
       width: 400,
       height: 100,
       clipX: 0,
       clipY: 0,
       clipWidth: 2*canvasWidth/3,
       clipHeight: canvasHeight
    },
  ]
};

const layout_1_2 = {
  frame: null,
  layers: [
    {
       x: 0,
       y: 0,
       width: canvasWidth/3,
       height: canvasHeight,
       clipX: 0,
       clipY: 0,
       clipWidth: canvasWidth/3,
       clipHeight: canvasHeight
    },
    {
       x: canvasWidth/3,
       y: 0,
       width: 2*canvasWidth/3,
       height: canvasHeight,
       clipX: 0,
       clipY: 0,
       clipWidth: 2*canvasWidth/3,
       clipHeight: canvasHeight
    },
  ]
};

const layout_1_2_O = {
  frame: null,
  layers: [
    {
       x: 0,
       y: 0,
       width: canvasWidth/2,
       height: canvasHeight,
       clipX: 0,
       clipY: 0,
       clipWidth: canvasWidth/2,
       clipHeight: canvasHeight
    },
    {
       x: canvasWidth/2,
       y: 0,
       width: canvasWidth/2,
       height: canvasHeight,
       clipX: 0,
       clipY: 0,
       clipWidth: canvasWidth/2,
       clipHeight: canvasHeight
    },
    {
       x: (canvasWidth/2)-100,
       y: (canvasHeight/2)-100,
       width: 200,
       height: 200,
       clipX: 0,
       clipY: 0,
       clipWidth: 200,
       clipHeight: 200,
       clipFunc: (ctx) =>{
            ctx.arc(140, 100, 100, 0, Math.PI * 2, false);
            ctx.arc(60, 100, 100, 0, Math.PI * 2, false);
          },
    },
  ]
};

const layout_2_2 = {
  frame: null,
  layers: [
    {
      x: 0,
      y: 0,
      width: canvasWidth/2,
      height: canvasHeight/2,
      clipX: 0,
      clipY: 0,
      clipWidth: canvasWidth/2,
      clipHeight: canvasHeight/2
    },{
      x: canvasWidth/2,
      y: 0,
      width: canvasWidth/2,
      height: canvasHeight/2,
      clipX: 0,
      clipY: 0,
      clipWidth: canvasWidth/2,
      clipHeight: canvasHeight/2
    },{
      x: 0,
      y: canvasHeight/2,
      width: canvasWidth/2,
      height: canvasHeight/2,
      clipX: 0,
      clipY: 0,
      clipWidth: canvasWidth/2,
      clipHeight: canvasHeight/2
    },{
      x: canvasWidth/2,
      y: canvasHeight/2,
      width: canvasWidth/2,
      height: canvasHeight/2,
      clipX: 0,
      clipY: 0,
      clipWidth: canvasWidth/2,
      clipHeight: canvasHeight/2
    },
  ]
};

export const getLayout = (i) =>{
  switch(i){
    case "example1": return example1;
    case "example1_broke": return example1_broke;
    case "layout_1_2": return layout_1_2;
    case "layout_1_2_O": return layout_1_2_O;
    case "layout_2_2": return layout_2_2;
    default: return layout_1_2;
  }
}
