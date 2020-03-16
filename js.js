var web = {

  axisRange: 100,

  cor: {},


  buildCor: function () {

    var df = document.getElementById('form')

    for (var i = 0; i < df.children.length; i++) {
      var d = df.children[i]
      web.cor[d.children[0].innerHTML] = [parseInt(d.children[1].value), parseInt(d.children[2].value)]
    }

    web.compare()
  },

  az: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'w', 'y', 'z'],
  azP: 0,

  getAz: function () {
    var b = Math.floor(web.azP / web.az.length) - 1
    var e = web.azP % web.az.length

    if (b < 0) return web.az[e]
    else return web.az[b] + web.az[e]
  },

  addCor: function (x, y) {

    var df = document.getElementById('form')
    var d = document.createElement('div')

    var dinl = document.createElement('div')
    dinl.className = 'inl'
    dinl.style.textTransform = 'uppercase'
    dinl.innerHTML = web.getAz()
    d.appendChild(dinl)

    var ix = document.createElement('input')
    ix.placeholder = 'x'
    ix.name = web.getAz() + 'x'
    ix.type = 'number'
    if (x) ix.value = x
    ix.onkeydown = web.onlyNum
    d.appendChild(ix)

    var iy = document.createElement('input')
    iy.placeholder = 'y'
    iy.name = web.getAz() + 'y'
    iy.type = 'number'
    if (y) iy.value = y
    iy.onkeydown = web.onlyNum
    d.appendChild(iy)

    df.appendChild(d)

    ix.focus()
    web.azP++
  },

  genCor: function (el) {
    var c = el.parentNode.children[0]
    web.filTemp(c.value)
    c.value = ''
  },

  filTemp: function (c) {
    var x = Math.floor(Math.random() * web.axisRange) + 1
    var y = Math.floor(Math.random() * web.axisRange) + 1
    web.addCor(x, y)
    c--

    if (c > 0) {
      setTimeout(function () {
        web.filTemp(c)
      }, 4)
    }
  },


  onlyNum: function () {

    if (event.keyCode == 13) {
      if (this.placeholder == 'x') this.nextElementSibling.focus()
      else web.addCor()

      return
    }


    var arr = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 9, 8, 46, 37, 38, 39, 40]
    var arr2 = [9, 8, 46, 37, 38, 39, 40]

    if (arr.indexOf(event.keyCode) + 1) {
      var pv = this.value + event.key
      if (parseInt(pv) > web.axisRange) {
        event.preventDefault()
        event.stopPropagation()
      }


    }


    // console.log(this.value.length, arr2.indexOf(event.keyCode))
    if (!(arr.indexOf(event.keyCode) + 1)) {
      event.preventDefault()
      event.stopPropagation()
    }

  },



  // Tablica bez przecięć
  createAngleArr: function () {
    var angleArr = []
    var maxX = 0
    var maxY = 0
    var minX = 9999
    var minY = 9999

    for (var prop in web.cor) {
      if (web.cor[prop][0] > maxX) maxX = web.cor[prop][0]
      if (web.cor[prop][0] < minX) minX = web.cor[prop][0]

      if (web.cor[prop][1] > maxY) maxY = web.cor[prop][1]
      if (web.cor[prop][1] < minY) minY = web.cor[prop][1]
    }

    var sx = (maxX - minX) / 2
    var sy = (maxY - minY) / 2

    for (var prop in web.cor) {

      var px = web.cor[prop][0]
      var py = web.cor[prop][1]

      var w = [(Math.atan2(sy - py, sx - px) * 180 / Math.PI) + 180, prop]
      angleArr.push(w)
    }

    angleArr.sort(function (a, b) {
      return a[0] - b[0]
    })

    for (var i = 0; i < angleArr.length; i++) {
      angleArr[i] = angleArr[i][1]
    }

    return angleArr


  },


  // Tablica najblizszych polaczen
  createNearestArr: function () {
    var nearestArr = []
    var tempCor = JSON.parse(JSON.stringify(web.cor))
    var p = 'c'

    while (Object.keys(tempCor).length) {

      nearestArr.push(p)

      var temp = web.cor[p]
      delete tempCor[p]
      var min = 99999
      var minP = ''

      for (var prop in tempCor) {
        var x1 = web.cor[p][0]
        var y1 = web.cor[p][1]
        var x2 = tempCor[prop][0]
        var y2 = tempCor[prop][1]

        var dist = Math.hypot(x2 - x1, y2 - y1)

        if (dist < min) {
          min = dist
          minP = prop
        }
      }

      p = minP

    }

    return nearestArr
  },


  // Porównanie algorytmów

  compare: function () {
    var aA = web.createAngleArr()
    var aN = web.createNearestArr()

    aAlen = 0
    aNlen = 0

    // canvas
    var dc = document.getElementById("can");
    dc.innerHTML = ''






    var c = document.createElement('canvas')
    dc.appendChild(c)
    c.id = 'net'

    var r = 5
    c.width = r * web.axisRange
    c.height = r * web.axisRange

    var ctx = c.getContext("2d")
    ctx.beginPath()
    ctx.strokeStyle = "#eaeaea"
    ctx.lineWidth = 1

    var netArr = [
      [0, 0],
      [0, 100],
      [5, 100],
      [5, 0],
      [10, 0],
      [10, 100]

    ]
    var sn = document.getElementById('setnet').value
    var sn = sn * 5
    for (var i = 0; i < web.axisRange; i++) {
      ctx.moveTo(i * sn, 0)
      ctx.lineTo(i * sn, web.axisRange * sn)


      ctx.moveTo(0, i * sn)
      ctx.lineTo(web.axisRange * sn, i * sn)

    }

    ctx.stroke()






    var c = document.createElement('canvas')
    dc.appendChild(c)
    c.id = 'red'

    var r = 5
    c.width = r * web.axisRange
    c.height = r * web.axisRange

    var ctx = c.getContext("2d")
    ctx.beginPath()
    ctx.strokeStyle = "red"
    ctx.setLineDash([5, 15]);
    ctx.lineWidth = 1

    for (var i = 0; i < aA.length; i++) {
      var p1 = web.cor[aA[i]]
      var p2 = i == aA.length - 1 ? web.cor[aA[0]] : web.cor[aA[i + 1]]
      //console.log(p1, p2)
      var x1 = p1[0]
      var y1 = p1[1]
      var x2 = p2[0]
      var y2 = p2[1]

      if (i == 0) ctx.lineTo(x1 * r, (web.axisRange - y1) * r)
      ctx.lineTo(x2 * r, (web.axisRange - y2) * r)

      var dist = Math.hypot(x2 - x1, y2 - y1)
      aAlen += dist
    }

    ctx.stroke()
    var bp = document.getElementById('bp')
    bp.innerHTML = `BEZ PRZECIĘĆ <br /> ${aAlen.toFixed(2)}`
    console.log('Bez przecięć', aA, aAlen.toFixed(6))








    document.getElementById('wykres').appendChild(dc)
    var c = document.createElement('canvas')
    dc.appendChild(c)
    var r = 5
    c.width = r * web.axisRange
    c.height = r * web.axisRange
    c.id = 'blue'
    var ctx = c.getContext("2d")
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.setLineDash([]);
    ctx.strokeStyle = "blue"


    for (var i = 0; i < aN.length; i++) {
      var p1 = web.cor[aN[i]]
      var p2 = i == aN.length - 1 ? web.cor[aN[0]] : web.cor[aN[i + 1]]
      //console.log(p1, p2)
      var x1 = p1[0]
      var y1 = p1[1]
      var x2 = p2[0]
      var y2 = p2[1]

      if (i == 0) ctx.lineTo(x1 * r, (web.axisRange - y1) * r)
      ctx.lineTo(x2 * r, (web.axisRange - y2) * r)

      var dist = Math.hypot(x2 - x1, y2 - y1)
      aNlen += dist
    }



    ctx.stroke()


    var np = document.getElementById('np')
    np.innerHTML = `NAJBLIŻSZY SĄSIAD <br />  ${aNlen.toFixed(2)}`
    console.log('Najblizszy sąsiadddddd', aN, aNlen.toFixed(6))


  },

  clickerB: 2,
  clickerR: 2,
  clickerS: 2,

  too: function (x, y, z) {
    if (z % 2) {
      document.getElementById(x).className = "on"
      document.getElementById(y).className = "on"
    } else {
      document.getElementById(x).className = "off"
      document.getElementById(y).className = "off"
    }
  },


  showBlue: function () {
    web.too('btnB', 'blue', web.clickerB)
    web.clickerB++
  },
  showRed: function () {
    web.too('btnR', 'red', web.clickerR)
    web.clickerR++
  },
  showNet: function () {
    web.too('btnS', 'net', web.clickerS)
    web.clickerS++
  },




}