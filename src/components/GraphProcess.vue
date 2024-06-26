<template>
    <g
            :class="process.type">
        <polyline
                v-if="process.isoline"
                :points="isoline"
                class="isoline"/>
        <polyline
                v-if="process.glow && $store.state.glow"
                class="glow"
                :points="line"/>
        <polyline
                class="line"
                :points="line"/>
        <polyline
                class="arrow"
                :points="arrow"/>
    </g>
</template>

<script>
  let arrowRotation = 0;
  export default {
    name: 'graph-process',
    props: {
      process: Object,
      graphType: String
    },
    data() {
      return {
      }
    },
    methods: {
      // utils
      makePolylinePoints(p) {
        // тут преобразовываем систему координат в 1 четверть (вместо 4 у svg)
        return p.map(v => [v[0], this.$store.state.svgSize-v[1]].join(' ')).join(' ')
      },
      isOverflow(x,y) {
        let ss = this.$store.state.svgSize;
        return x > ss || y > ss
      },
      getHyperbolaMidpointer(start, end, constant, step=10) {
        let distance = (p1, p2) => Math.sqrt(Math.pow(p1[0]-p2[0], 2)+Math.pow(p1[1]-p2[1], 2));
        let points = [];
        points.push([start, constant/start]);
        let dp = [];
        dp[0] = 0;

        let i = 1;
        let midPointer = 0;
        for (let x = Math.ceil(start/step)*step; x <= Math.floor(end/step)*step; x += step) {
          let prev = points[i-1];
          let curr = [x, constant/x];
          dp[i] = dp[i-1] + distance(curr, prev);
          while (dp[midPointer]*2 < dp[i]) midPointer++;
          points.push(curr);
          i++
        }
        let prev = points[i-1];
        let curr = [end, constant/end];
        dp[i] = dp[i-1] + distance(curr, prev);
        while (dp[midPointer]*2 < dp[i]) midPointer++;
        points.push(curr);
//        console.log(dp);
        return midPointer
      },
      // низшие функции
      getHyperbola(start, end, constant, step=10, overflow=false) {
        // при overflow = true он будет добавлять даже те точки, которые выходят за пределы svg
        let points = [];
        if (overflow || !this.isOverflow(start, constant/start)) points.push([start, constant/start]);
        for (let x = Math.ceil(start/step)*step; x <= Math.floor(end/step)*step; x += step) {
          let y = constant/x;
          if (!overflow && this.isOverflow(x-step, constant/(x+step))) continue;
          points.push([x, y])
        }
        if (overflow || !this.isOverflow(end, constant/end)) points.push([end, constant/end]);
        return points
      },
      getVerticalLine(start, end, x) {
        return [[x, start], [x, end]]
      },
      getHorizontalLine(start, end, y) {
        return [[start, y], [end, y]]
      },
      getInclinedLine(start, end, c) {
        return [[start, start*c], [end, end*c]]
      },
      getArrow(x, y, a=arrowRotation) {
        let l = 40;
        let w = 10;
        let s = Math.sqrt(l*l+w*w); // side
        let b = Math.atan2(w, l);
        // a - угол поворота всей стрелки
        // b - константный угол поворота сторон стрелки

        y += (l/2)*Math.cos(a); // смещаем центр
        x -= (l/2)*Math.sin(a);

        return [[x-s*Math.sin(b-a), y-s*Math.cos(b-a)], [x, y], [x+s*Math.sin(b+a), y-s*Math.cos(b+a)]]
      },
      processHyperbola(start, end, constant) {
        return this.makePolylinePoints(this.getHyperbola(start, end, constant))
      },
      processVerticalLine(start, end, x) {
        return this.makePolylinePoints(this.getVerticalLine(start, end, x))
      },
      processHorizontalLine(start, end, y) {
        return this.makePolylinePoints(this.getHorizontalLine(start, end, y))
      },
      processInclinedLine(start, end, c) {
        return this.makePolylinePoints(this.getInclinedLine(start, end, c))
      },
      // обертки для низших функций
      makeHyperbola(v, c) {
        return this.processHyperbola(...v.start > v.end ? [v.end, v.start] : [v.start, v.end], c) // min, max, const
      },
      makeVerticalLine(v, c) {
        return this.processVerticalLine(...v.start > v.end ? [v.end, v.start] : [v.start, v.end], c)
      },
      makeHorizontalLine(v, c) {
        return this.processHorizontalLine(...v.start > v.end ? [v.end, v.start] : [v.start, v.end], c)
      },
      makeInclinedLine(v, c) {
        return this.processInclinedLine(...v.start > v.end ? [v.end, v.start] : [v.start, v.end], c)
      }
    },
    computed: {
      line() {
        let nur = this.$store.state.nur;
        let {type, p, v, t} = this.process;
        if (this.graphType === 'pv') {
          if (type === 'isothermal') return this.makeHyperbola(v, t*nur);
          if (type === 'isochoric') return this.makeVerticalLine(p, v);
          if (type === 'isobaric') return this.makeHorizontalLine(v, p);
        }
        else if (this.graphType === 'vt') {
          if (type === 'isothermal') return this.makeVerticalLine(v, t);
          if (type === 'isochoric') return this.makeHorizontalLine(t, v);
          if (type === 'isobaric') return this.makeInclinedLine(t, nur/p);
          //                     деление - чтобы 45deg было равно [nur] K, а не 1K ^^^^^^^^^^^
          // а еще потому, что коэффициент наклона обратно пропорционален p (p больше => угол наклона меньше)
        }
        else if (this.graphType === 'pt') {
          if (type === 'isothermal') return this.makeVerticalLine(p, t);
          if (type === 'isochoric') return this.makeInclinedLine(t, nur/v);
          if (type === 'isobaric') return this.makeHorizontalLine(t, p);
        }
      },
      isoline() {
        let nur = this.$store.state.nur;
        let {type, p, v, t} = this.process;
        if (this.graphType === 'pv') {
          if (type === 'isothermal') return this.processHyperbola(1, 1000, t*nur);
          if (type === 'isochoric') return this.processVerticalLine(1, 1000, v);
          if (type === 'isobaric') return this.processHorizontalLine(1, 1000, p);
        }
        else if (this.graphType === 'vt') {
          if (type === 'isothermal') return this.processVerticalLine(1, 1000, t);
          if (type === 'isochoric') return this.processHorizontalLine(1, 1000, v);
          if (type === 'isobaric') return this.processInclinedLine(1, 1000, nur/p);
        }
        else if (this.graphType === 'pt') {
          if (type === 'isothermal') return this.processVerticalLine(1, 1000, t);
          if (type === 'isochoric') return this.processInclinedLine(1, 1000, nur/v);
          if (type === 'isobaric') return this.processHorizontalLine(1, 1000, p);
        }
      },
      arrow() {
        let nur = this.$store.state.nur;
        let {type, p, v, t} = this.process;
        return this.makePolylinePoints((() => {
          if (this.graphType === 'pv') {
            if (type === 'isothermal') {
              let args = [...v.start > v.end ? [v.end, v.start] : [v.start, v.end], t*nur, 1];
              let mp = this.getHyperbolaMidpointer(...args);
              let points = this.getHyperbola(...args, true);
              let angle = 0;
              if (mp === 0) {
                let c = points[mp];
                let n = points[mp+1];
                angle = Math.atan2(Math.abs(c[1]-n[1]), Math.abs(c[0]-n[0]))
              }
              else if (points.length-1 === mp) {
                let c = points[mp];
                let p = points[mp-1];
                angle = Math.atan2(Math.abs(c[1]-p[1]), Math.abs(c[0]-p[0]))
              }
              else {
                let c = points[mp];
                let p = points[mp-1];
                let n = points[mp+1];
                angle = (
                  Math.atan2(Math.abs(c[1]-p[1]), Math.abs(c[0]-p[0]))
                  +
                  Math.atan2(Math.abs(c[1]-n[1]), Math.abs(c[0]-n[0]))
                ) /2
              }
              return this.getArrow(...this.centerPoint, (p.start < p.end ? 0 : Math.PI)+Math.PI/2-angle)
            }
            if (type === 'isochoric') return this.getArrow(...this.centerPoint, p.start < p.end ? 0 : Math.PI);
            if (type === 'isobaric') return this.getArrow(...this.centerPoint, (v.start < v.end ? 0 : Math.PI)-Math.PI/2);
          }
          if (this.graphType === 'vt') {
            if (type === 'isothermal') return this.getArrow(...this.centerPoint, v.start < v.end ? 0 : Math.PI);
            if (type === 'isochoric') return this.getArrow(...this.centerPoint, (t.start < t.end ? 0 : Math.PI)-Math.PI/2);
            if (type === 'isobaric') return this.getArrow(...this.centerPoint,
              (t.start < t.end ? 0 : Math.PI)-Math.atan2(Math.abs(t.end-t.start), Math.abs(v.end-v.start))
            );
          }
          if (this.graphType === 'pt') {
            if (type === 'isothermal') return this.getArrow(...this.centerPoint, p.start < p.end ? 0 : Math.PI);
            if (type === 'isochoric') return this.getArrow(...this.centerPoint,
              (t.start < t.end ? 0 : Math.PI)-Math.atan2(Math.abs(t.end-t.start), Math.abs(p.end-p.start))
            );
            if (type === 'isobaric') return this.getArrow(...this.centerPoint, (t.start < t.end ? 0 : Math.PI)-Math.PI/2);
          }
        })())
        /*if (this.graphType === 'pv') {
          if (type === 'isothermal') return this.makeHyperbola(v, t*500);
          if (type === 'isochoric') return this.getArrow(v, (p.start+p.end)/2, p.start < p.end ? 0 : Math.PI/2);
          if (type === 'isobaric') return this.makeHorizontalLine(v, p);
        }
        else if (this.graphType === 'vt') {
          if (type === 'isothermal') return this.makeVerticalLine(v, t);
          if (type === 'isochoric') return this.makeHorizontalLine(t, v);
          if (type === 'isobaric') return this.makeInclinedLine(t, 500/p);
          //                                  деление - чтобы 45deg было равно 500K, а не 1K ^^^
          // а еще потому, что коэффициент наклона обратно пропорционален p (p больше => угол наклона меньше)
        }
        else if (this.graphType === 'pt') {
          if (type === 'isothermal') return this.makeVerticalLine(p, t);
          if (type === 'isochoric') return this.makeInclinedLine(t, 500/v);
          if (type === 'isobaric') return this.makeHorizontalLine(t, p);
        }*/
      },
      centerPoint() {
        let nur = this.$store.state.nur;
        let {type, p, v, t} = this.process;
        if (this.graphType === 'pv') {
          if (type === 'isothermal') {
            let args = [...v.start > v.end ? [v.end, v.start] : [v.start, v.end], t*nur, 1];
            let mp = this.getHyperbolaMidpointer(...args);
            let points = this.getHyperbola(...args, true);
            return points[mp]
          }
          if (type === 'isochoric') return [v, (p.start+p.end)/2];
          if (type === 'isobaric') return [(v.start+v.end)/2, p];
        }
        if (this.graphType === 'vt') {
          if (type === 'isothermal') return [t, (v.start+v.end)/2];
          if (type === 'isochoric') return [(t.start+t.end)/2, v];
          if (type === 'isobaric') return [(t.start+t.end)/2, (v.start+v.end)/2]
        }
        if (this.graphType === 'pt') {
          if (type === 'isothermal') return [t, (p.start+p.end)/2];
          if (type === 'isochoric') return [(t.start+t.end)/2, (p.start+p.end)/2];
          if (type === 'isobaric') return [(t.start+t.end)/2, p];
        }
      }
    }
  }
</script>

<style scoped lang="less">
    @import "../assets/vars.less";
    .isothermal {
        .line, .glow, .isoline {stroke: @isothermal}
        .arrow {fill: @isothermal}
    }
    .isobaric {
        .line, .glow, .isoline {stroke: @isobaric}
        .arrow {fill: @isobaric}
    }
    .isochoric {
        .line, .glow, .isoline {stroke: @isochoric}
        .arrow {fill: @isochoric}
    }
    .line {
        /*shape-rendering: geometricPrecision;*/
        fill: none;
        stroke-width: 8;
        stroke-linecap: round;
        stroke-linejoin: round;
    }
    .glow {
        fill: none;
        stroke-width: 50;
        opacity: .25;
        stroke-linecap: round;
        stroke-linejoin: round;
    }
    .isoline {
        fill: none;
        stroke-width: 3;
        stroke-dasharray: 5 5;
        opacity: .5;
        /*stroke-dashoffset: 10;*/
        /*stroke-linecap: round;*/
        /*stroke-linejoin: round;*/
    }
</style>