<template>
<div>
  <v-card>
    <div style="display:flex">
      <v-subheader>Relevant Words </v-subheader><v-spacer></v-spacer><v-icon style="margin-right:12px" v-if="this.lock">mdi-lock</v-icon>
    </div>
    <div style="height:69.874vh;overflow-x:hidden;overflow-y:scroll">
      <v-expansion-panels accordion multiple>
        <v-expansion-panel v-for="(key,keyIndex) in Object.keys(words)" :key="keyIndex">
          <v-expansion-panel-header>{{words[key].count}} {{key}} ({{words[key].list.length}} words)</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-list style="padding-top:0px">
              <v-list-item style="margin-bottom:-20px" v-for="(word,index) in words[key].list" :key=index>{{word.text || word}}</v-list-item>
            </v-list>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </v-card>
  
</div>
</template>

<script>

  export default {
    data() {
      return {
        size: {
          width: 0,
          height: 0,
        }
      }
    },
    props: ["resizewatcher", "lock"],
    watch: {},
    computed: {
      words: function () {
        return this.calculateWords();
      },
    },
    mounted() {
      this.resizeWithWindow();
      window.onresize = this.resizeWithWindow;
    },
    methods: {
      resizeWithWindow: function () {
        this.initializeVariables();
      },
      initializeVariables: function () {
        this.size.width = window.innerWidth * 0.2;
        this.size.height = window.innerHeight * 0.72;
      },
      calculateWords: function(){
        var interactionViewData = this.$store.state.interactionViewData;
        var stopWords = ["on", "for", "i", "and", "a", "of", "in", "to", "br", "the", "will", "at", "was", "is", "you", "that", "from", "we", "as", "it", "have", "with", "be", "by", "they", "he", "an", "this", "are", "s", "not", "were", "who", "can", "about", "t", "0o", "0s", "3a", "3b", "3d", "6b", "6o", "a", "A", "a1", "a2", "a3", "a4", "ab", "able", "about", "above", "abst", "ac", "accordance", "according", "accordingly", "across", "act", "actually", "ad", "added", "adj", "ae", "af", "affected", "affecting", "after", "afterwards", "ag", "again", "against", "ah", "ain", "aj", "al", "all", "allow", "allows", "almost", "alone", "along", "already", "also", "although", "always", "am", "among", "amongst", "amoungst", "amount", "an", "and", "announce", "another", "any", "anybody", "anyhow", "anymore", "anyone", "anyway", "anyways", "anywhere", "ao", "ap", "apart", "apparently", "appreciate", "approximately", "ar", "are", "aren", "arent", "arise", "around", "as", "aside", "ask", "asking", "at", "au", "auth", "av", "available", "aw", "away", "awfully", "ax", "ay", "az", "b", "B", "b1", "b2", "b3", "ba", "back", "bc", "bd", "be", "became", "been", "before", "beforehand", "beginnings", "behind", "below", "beside", "besides", "best", "between", "beyond", "bi", "bill", "biol", "bj", "bk", "bl", "bn", "both", "bottom", "bp", "br", "brief", "briefly", "bs", "bt", "bu", "but", "bx", "by", "c", "C", "c1", "c2", "c3", "ca", "call", "came", "can", "cannot", "cant", "cc", "cd", "ce", "certain", "certainly", "cf", "cg", "ch", "ci", "cit", "cj", "cl", "clearly", "cm", "cn", "co", "com", "come", "comes", "con", "concerning", "consequently", "consider", "considering", "could", "couldn", "couldnt", "course", "cp", "cq", "cr", "cry", "cs", "ct", "cu", "cv", "cx", "cy", "cz", "d", "D", "d2", "da", "date", "dc", "dd", "de", "definitely", "describe", "described", "despite", "detail", "df", "di", "did", "didn", "dj", "dk", "dl", "do", "does", "doesn", "doing", "don", "done", "down", "downwards", "dp", "dr", "ds", "dt", "du", "due", "during", "dx", "dy", "e", "E", "e2", "e3", "ea", "each", "ec", "ed", "edu", "ee", "ef", "eg", "ei", "eight", "eighty", "either", "ej", "el", "eleven", "else", "elsewhere", "em", "en", "end", "ending", "enough", "entirely", "eo", "ep", "eq", "er", "es", "especially", "est", "et", "et-al", "etc", "eu", "ev", "even", "ever", "every", "everybody", "everyone", "everything", "everywhere", "ex", "exactly", "example", "except", "ey", "f", "F", "f2", "fa", "far", "fc", "few", "ff", "fi", "fifteen", "fifth", "fify", "fill", "find", "fire", "five", "fix", "fj", "fl", "fn", "fo", "followed", "following", "follows", "for", "former", "formerly", "forth", "forty", "found", "four", "fr", "from", "front", "fs", "ft", "fu", "full", "further", "furthermore", "fy", "g", "G", "ga", "gave", "ge", "get", "gets", "getting", "gi", "give", "given", "gives", "giving", "gj", "gl", "go", "goes", "going", "gone", "got", "gotten", "gr", "greetings", "gs", "gy", "h", "H", "h2", "h3", "had", "hadn", "happens", "hardly", "has", "hasn", "hasnt", "have", "haven", "having", "he", "hed", "hello", "help", "hence", "here", "hereafter", "hereby", "herein", "heres", "hereupon", "hes", "hh", "hi", "hid", "hither", "hj", "ho", "hopefully", "how", "howbeit", "however", "hr", "hs", "http", "hu", "hundred", "hy", "i2", "i3", "i4", "i6", "i7", "i8", "ia", "ib", "ibid", "ic", "id", "ie", "if", "ig", "ignored", "ih", "ii", "ij", "il", "im", "immediately", "in", "inasmuch", "inc", "indeed", "index", "indicate", "indicated", "indicates", "information", "inner", "insofar", "instead", "interest", "into", "inward", "io", "ip", "iq", "ir", "is", "isn", "it", "itd", "its", "iv", "ix", "iy", "iz", "j", "J", "jj", "jr", "js", "jt", "ju", "just", "k", "K", "ke", "keep", "keeps", "kept", "kg", "kj", "km", "ko", "l", "L", "l2", "la", "largely", "last", "lately", "later", "latter", "latterly", "lb", "lc", "le", "least", "les", "less", "lest", "let", "lets", "lf", "like", "liked", "likely", "line", "little", "lj", "ll", "ln", "lo", "look", "looking", "looks", "los", "lr", "ls", "lt", "ltd", "m", "M", "m2", "ma", "made", "mainly", "make", "makes", "many", "may", "maybe", "me", "meantime", "meanwhile", "merely", "mg", "might", "mightn", "mill", "million", "mine", "miss", "ml", "mn", "mo", "more", "moreover", "most", "mostly", "move", "mr", "mrs", "ms", "mt", "mu", "much", "mug", "must", "mustn", "my", "n", "N", "n2", "na", "name", "namely", "nay", "nc", "nd", "ne", "near", "nearly", "necessarily", "neither", "nevertheless", "new", "next", "ng", "ni", "nine", "ninety", "nj", "nl", "nn", "no", "nobody", "non", "none", "nonetheless", "noone", "nor", "normally", "nos", "not", "noted", "novel", "now", "nowhere", "nr", "ns", "nt", "ny", "o", "O", "oa", "ob", "obtain", "obtained", "obviously", "oc", "od", "of", "off", "often", "og", "oh", "oi", "oj", "ok", "okay", "ol", "old", "om", "omitted", "on", "once", "one", "ones", "only", "onto", "oo", "op", "oq", "or", "ord", "os", "ot", "otherwise", "ou", "ought", "our", "out", "outside", "over", "overall", "ow", "owing", "own", "ox", "oz", "p", "P", "p1", "p2", "p3", "page", "pagecount", "pages", "par", "part", "particular", "particularly", "pas", "past", "pc", "pd", "pe", "per", "perhaps", "pf", "ph", "pi", "pj", "pk", "pl", "placed", "please", "plus", "pm", "pn", "po", "poorly", "pp", "pq", "pr", "predominantly", "presumably", "previously", "primarily", "probably", "promptly", "proud", "provides", "ps", "pt", "pu", "put", "py", "q", "Q", "qj", "qu", "que", "quickly", "quite", "qv", "r", "R", "r2", "ra", "ran", "rather", "rc", "rd", "re", "readily", "really", "reasonably", "recent", "recently", "ref", "refs", "regarding", "regardless", "regards", "related", "relatively", "research-articl", "respectively", "resulted", "resulting", "results", "rf", "rh", "ri", "right", "rj", "rl", "rm", "rn", "ro", "rq", "rr", "rs", "rt", "ru", "run", "rv", "ry", "s", "S", "s2", "sa", "said", "saw", "say", "saying", "says", "sc", "sd", "se", "sec", "second", "secondly", "section", "seem", "seemed", "seeming", "seems", "seen", "sent", "seven", "several", "sf", "shall", "shan", "shed", "shes", "show", "showed", "shown", "showns", "shows", "si", "side", "since", "sincere", "six", "sixty", "sj", "sl", "slightly", "sm", "sn", "so", "some", "somehow", "somethan", "sometime", "sometimes", "somewhat", "somewhere", "soon", "sorry", "sp", "specifically", "specified", "specify", "specifying", "sq", "sr", "ss", "st", "still", "stop", "strongly", "sub", "substantially", "successfully", "such", "sufficiently", "suggest", "sup", "sure", "sy", "sz", "t", "T", "t1", "t2", "t3", "take", "taken", "taking", "tb", "tc", "td", "te", "tell", "ten", "tends", "tf", "th", "than", "thank", "thanks", "thanx", "that", "thats", "the", "their", "theirs", "them", "themselves", "then", "thence", "there", "thereafter", "thereby", "thered", "therefore", "therein", "thereof", "therere", "theres", "thereto", "thereupon", "these", "they", "theyd", "theyre", "thickv", "thin", "think", "third", "this", "thorough", "thoroughly", "those", "thou", "though", "thoughh", "thousand", "three", "throug", "through", "throughout", "thru", "thus", "ti", "til", "tip", "tj", "tl", "tm", "tn", "to", "together", "too", "took", "top", "toward", "towards", "tp", "tq", "tr", "tried", "tries", "truly", "try", "trying", "ts", "tt", "tv", "twelve", "twenty", "twice", "two", "tx", "u", "U", "u201d", "ue", "ui", "uj", "uk", "um", "un", "under", "unfortunately", "unless", "unlike", "unlikely", "until", "unto", "uo", "up", "upon", "ups", "ur", "us", "used", "useful", "usefully", "usefulness", "using", "usually", "ut", "v", "V", "va", "various", "vd", "ve", "very", "via", "viz", "vj", "vo", "vol", "vols", "volumtype", "vq", "vs", "vt", "vu", "w", "W", "wa", "was", "wasn", "wasnt", "way", "we", "wed", "welcome", "well", "well-b", "went", "were", "weren", "werent", "what", "whatever", "whats", "when", "whence", "whenever", "where", "whereafter", "whereas", "whereby", "wherein", "wheres", "whereupon", "wherever", "whether", "which", "while", "whim", "whither", "who", "whod", "whoever", "whole", "whom", "whomever", "whos", "whose", "why", "wi", "widely", "with", "within", "without", "wo", "won", "wonder", "wont", "would", "wouldn", "wouldnt", "www", "x", "X", "x1", "x2", "x3", "xf", "xi", "xj", "xk", "xl", "xn", "xo", "xs", "xt", "xv", "xx", "y", "Y", "y2", "yes", "yet", "yj", "yl", "you", "youd", "your", "youre", "yours", "yr", "ys", "yt", "z", "Z", "zero", "zi", "zz", "", "2bottomup", "3topdown"];

        return {
          "Searches": this.calculateWordsByInteractionType(interactionViewData, "SEARCH", stopWords),
          "Highlights": this.calculateWordsByInteractionType(interactionViewData, "HIGHLIGHT", stopWords),
          "Write Notes": this.calculateWordsByInteractionType(interactionViewData, "WRITE_NOTE", stopWords),
          "Topic Changes": this.calculateWordsByInteractionType(interactionViewData, "TOPIC_CHANGE", stopWords),
          "Open Documents" : this.calculateDocOpenWords(this.$store.state.interactionViewData),
        }
      },
      calculateWordsByInteractionType: function(interactionViewData, interactionType, stopWords){
        var typeData = interactionViewData[interactionType],
            result = {count:typeData.length,list:[]};
        for (var i = 0; i < typeData.length; i++) {
          var tempWords = typeData[i]['Text'].replace(/[^\w\s]/gi, "").split(" ");
          for (var j = 0; j < tempWords.length; j++) {
            if (!stopWords.includes(tempWords[j])) {
              if (!result.list.includes(tempWords[j])) {
                result.list.push(tempWords[j])
              }
            }
          }
        }
        return result;
      },
      calculateDocOpenWords: function (interactionViewData) {
        var result = {count:0,list:[]};
        if (!interactionViewData || !Object.keys(interactionViewData).includes("DOC_OPEN")){
          return result;
        }
        var docIDs = [],
          histograms,
          repVec = [],
          docData = interactionViewData.DOC_OPEN,
          docTitles;
        //Check that at least one document exists
        docData.forEach(function (docDataItem) {
          docTitles = docDataItem.Text.split(" ");
          docIDs.push(docTitles[docTitles.length - 1])
        });

        result.count = docData.length;

        histograms = window["histograms" + this.$store.state.selected.datasetID];

        if(docIDs.length>0){
          //Generate representative vector
          //var repVec = histograms.documents[docIDs[0]-1]
          for (var histogramWordIndex = 0; histogramWordIndex < histograms.words.length; histogramWordIndex++) {
            repVec.push(histograms.documents[docIDs[0] - 1].histogram[histogramWordIndex])
          }
          for (var docIdIndex = 1; docIdIndex < docIDs.length; docIdIndex++) {
            //Sum the histograms
            for (histogramWordIndex = 0; histogramWordIndex < histograms.words.length; histogramWordIndex++) {
              repVec[histogramWordIndex] += histograms.documents[docIDs[docIdIndex] - 1].histogram[histogramWordIndex]
            }
          }
          result.list = this.zipArrayMax(repVec, histograms.words, 30).sort(function(a,b){
            return b.notSize - a.notSize;
          });
          return result;
        } else {
          return result;
        }
        
      },
      //Sort out the top n words in a vector
      zipArrayMax: function zipArrayMax(weights, words, n) {
        var zipped = []
        for (var i = 0; i < weights.length; i++) {
          //I don't know why, but when the "notSize" variable is named "size" it sets the top n values of "size" equal to 0
          //When it is named "weight", it sets the top n values to "normal"
          //Do not attempt to give this variable a meaningful name, it is evidently cursed
          zipped.push({
            notSize: weights[i],
            text: words[i]
          })
        }
        zipped.sort(function (x, y) {
          return x.notSize - y.notSize
        })
        var topN = zipped.slice(-n);

        //Normalize sizes
        var sum = 0
        for (var nIndex = 0; nIndex < n; nIndex++) {
          sum += topN[nIndex].notSize
        }
        for (nIndex = 0; nIndex < n; nIndex++) {
          topN[nIndex].notSize = topN[nIndex].notSize / sum * 500
        }
        return topN;

      },
    }
  };
</script>
