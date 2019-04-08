const imageElt   = document.getElementById("image");
const classNames = [ 'T-shirt/top'
                    , 'Trouser'
                    , 'Pullover'
                    , 'Dress'
                    , 'Coat'
                    , 'Sandal'
                    , 'Shirt'
                    , 'Sneaker'
                    , 'Bag'
                    , 'Ankle boot'
                    ];

// Built from: https://www.tensorflow.org/tutorials/keras/basic_classification

async function loadModel () {
  const model = await tf.loadLayersModel('model/model.json');
  return model;
}


function classify (model) {
  const input = tf.browser.fromPixels(imageElt, numChannels=1).reshape([1, 28, 28]);
  const preds = model.predict(input);
  preds.data().then(renderPredictions);
}


function renderPredictions (preds) {
  console.log(preds);
  data = []

  for( var i = 0; i < preds.length; i++ ){
    data.push( { "Probability": preds[i], "Class": classNames[i] });
  }

  console.log(data);
  var spec = { "$schema": "https://vega.github.io/schema/vega-lite/v3.json",
      "height": 200,
      "width": 400,
      "data": { "values": data },
      "mark": "bar",
      "encoding": {
            "x": {"field": "Probability", "type": "quantitative"},
            "y": {"field": "Class", "type": "ordinal"}
          }
  }
  vegaEmbed('#chart', spec);
}


function setupClipboardListener (model) {
  imageElt.onload = function () { classify(model); }

  // https://stackoverflow.com/a/15369753
  document.onpaste = function (event) {
    // use event.originalEvent.clipboard for newer chrome versions
    var items = (event.clipboardData  || event.originalEvent.clipboardData).items;
    console.log(JSON.stringify(items)); // will give you the mime types
    // find pasted image among pasted items
    var blob = null;
    for (var i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") === 0) {
        blob = items[i].getAsFile();
      }
    }
    // load image if there is a pasted image
    if (blob !== null) {
      var reader = new FileReader();
      reader.onload = function(event) {
        imageElt.src = event.target.result;
      };
      reader.readAsDataURL(blob);
    }
  }
}

loadModel().then(setupClipboardListener);

