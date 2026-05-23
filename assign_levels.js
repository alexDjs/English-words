// Script to assign CEFR levels to words in words.js
// Levels: A1, A2, B1, B2 — based on Oxford 3000/5000
// Words not in the map get level "C1" (shown in "All words" / C2 view too)

const fs = require('fs');

// Oxford 3000/5000 CEFR word map (lowercase word → level)
// When a word has multiple parts of speech at different levels, we use the lowest (most accessible) level
const CEFR = {
  // A1
  a:'A1',able:'A1',about:'A1',above:'A1',across:'A1',act:'A1',activity:'A1',actually:'A1',add:'A1',advice:'A1',
  afraid:'A1',after:'A1',afternoon:'A1',again:'A1',age:'A1',ago:'A1',agree:'A1',ahead:'A1',air:'A1',airport:'A1',
  all:'A1',also:'A1',always:'A1',and:'A1',angry:'A1',animal:'A1',another:'A1',answer:'A1',any:'A1',area:'A1',
  arm:'A1',around:'A1',arrive:'A1',art:'A1',ask:'A1',at:'A1',august:'A1',aunt:'A1',away:'A1',baby:'A1',
  back:'A1',bad:'A1',bag:'A1',ball:'A1',banana:'A1',band:'A1',bank:'A1',bath:'A1',be:'A1',beach:'A1',
  beautiful:'A1',because:'A1',become:'A1',bed:'A1',bedroom:'A1',before:'A1',begin:'A1',below:'A1',best:'A1',
  between:'A1',big:'A1',bird:'A1',birthday:'A1',black:'A1',blog:'A1',blonde:'A1',blue:'A1',boat:'A1',body:'A1',
  book:'A1',bored:'A1',boring:'A1',born:'A1',both:'A1',bottle:'A1',box:'A1',boy:'A1',bread:'A1',break:'A1',
  breakfast:'A1',brother:'A1',brown:'A1',building:'A1',bus:'A1',busy:'A1',but:'A1',buy:'A1',bye:'A1',
  cafe:'A1',cake:'A1',call:'A1',camera:'A1',cannot:'A1',capital:'A1',car:'A1',card:'A1',carry:'A1',cat:'A1',
  cd:'A1',cent:'A1',centre:'A1',century:'A1',chair:'A1',change:'A1',chart:'A1',cheap:'A1',check:'A1',
  cheese:'A1',child:'A1',children:'A1',city:'A1',class:'A1',classroom:'A1',clean:'A1',climb:'A1',clock:'A1',
  close:'A1',clothes:'A1',club:'A1',coat:'A1',coffee:'A1',cold:'A1',college:'A1',colour:'A1',come:'A1',
  common:'A1',computer:'A1',concert:'A1',cook:'A1',correct:'A1',cost:'A1',could:'A1',country:'A1',course:'A1',
  cousin:'A1',cow:'A1',cream:'A1',create:'A1',cut:'A1',dad:'A1',dance:'A1',dancer:'A1',dancing:'A1',
  dark:'A1',date:'A1',day:'A1',december:'A1',decide:'A1',delicious:'A1',design:'A1',different:'A1',
  difficult:'A1',dinner:'A1',dirty:'A1',do:'A1',dog:'A1',dollar:'A1',door:'A1',down:'A1',downstairs:'A1',
  draw:'A1',dress:'A1',drink:'A1',drive:'A1',each:'A1',ear:'A1',early:'A1',easy:'A1',eat:'A1',egg:'A1',
  eight:'A1',email:'A1',end:'A1',evening:'A1',every:'A1',example:'A1',excited:'A1',exciting:'A1',
  exercise:'A1',expensive:'A1',extra:'A1',eye:'A1',face:'A1',fact:'A1',family:'A1',fast:'A1',fat:'A1',
  father:'A1',favourite:'A1',february:'A1',feel:'A1',feeling:'A1',few:'A1',fill:'A1',film:'A1',final:'A1',
  find:'A1',fine:'A1',first:'A1',fish:'A1',five:'A1',flight:'A1',floor:'A1',flower:'A1',fly:'A1',food:'A1',
  foot:'A1',football:'A1',for:'A1',free:'A1',friend:'A1',from:'A1',front:'A1',fruit:'A1',full:'A1',fun:'A1',
  funny:'A1',future:'A1',game:'A1',geography:'A1',get:'A1',girl:'A1',girlfriend:'A1',give:'A1',glass:'A1',
  go:'A1',good:'A1',great:'A1',green:'A1',grey:'A1',group:'A1',grow:'A1',guess:'A1',guitar:'A1',gym:'A1',
  hair:'A1',hand:'A1',happy:'A1',hat:'A1',hate:'A1',have:'A1',head:'A1',hello:'A1',help:'A1',here:'A1',
  hey:'A1',hi:'A1',high:'A1',history:'A1',home:'A1',hope:'A1',hot:'A1',hotel:'A1',house:'A1',how:'A1',
  i:'A1',ice:'A1',idea:'A1',if:'A1',important:'A1',in:'A1',interesting:'A1',it:'A1',its:'A1',jacket:'A1',
  january:'A1',jeans:'A1',job:'A1',join:'A1',keep:'A1',key:'A1',kind:'A1',kitchen:'A1',know:'A1',
  language:'A1',large:'A1',last:'A1',later:'A1',laugh:'A1',learn:'A1',leave:'A1',left:'A1',leg:'A1',
  lesson:'A1',let:'A1',letter:'A1',light:'A1',like:'A1',line:'A1',lion:'A1',listen:'A1',little:'A1',
  live:'A1',long:'A1',look:'A1',love:'A1',lunch:'A1',make:'A1',man:'A1',many:'A1',maybe:'A1',me:'A1',
  meet:'A1',meeting:'A1',member:'A1',message:'A1',metre:'A1',midnight:'A1',mile:'A1',minute:'A1',miss:'A1',
  money:'A1',month:'A1',morning:'A1',mother:'A1',mouse:'A1',much:'A1',music:'A1',my:'A1',name:'A1',
  new:'A1',next:'A1',nice:'A1',night:'A1',nine:'A1',no:'A1',north:'A1',nose:'A1',not:'A1',note:'A1',
  now:'A1',number:'A1',of:'A1',often:'A1',old:'A1',on:'A1',once:'A1',only:'A1',open:'A1',or:'A1',
  orange:'A1',order:'A1',other:'A1',our:'A1',out:'A1',over:'A1',page:'A1',paint:'A1',painting:'A1',
  pair:'A1',paper:'A1',paragraph:'A1',parent:'A1',park:'A1',passport:'A1',past:'A1',period:'A1',
  phone:'A1',photo:'A1',photograph:'A1',phrase:'A1',piano:'A1',picture:'A1',piece:'A1',pig:'A1',pink:'A1',
  place:'A1',programme:'A1',put:'A1',question:'A1',quarter:'A1',quick:'A1',quickly:'A1',quiet:'A1',
  read:'A1',really:'A1',red:'A1',relax:'A1',remember:'A1',repeat:'A1',report:'A1',restaurant:'A1',return:'A1',
  right:'A1',road:'A1',room:'A1',rule:'A1',run:'A1',same:'A1',salt:'A1',sandwich:'A1',saturday:'A1',
  say:'A1',school:'A1',science:'A1',scientist:'A1',sea:'A1',section:'A1',see:'A1',sell:'A1',send:'A1',
  sentence:'A1',seven:'A1',share:'A1',she:'A1',sheep:'A1',shirt:'A1',shoe:'A1',shop:'A1',similar:'A1',
  simple:'A1',since:'A1',sister:'A1',six:'A1',skill:'A1',skirt:'A1',sleep:'A1',small:'A1',snake:'A1',
  so:'A1',some:'A1',sometimes:'A1',son:'A1',sorry:'A1',sound:'A1',soup:'A1',speak:'A1',spelling:'A1',
  spend:'A1',spring:'A1',stand:'A1',star:'A1',start:'A1',statement:'A1',station:'A1',stay:'A1',
  still:'A1',stop:'A1',street:'A1',student:'A1',study:'A1',summer:'A1',sure:'A1',swim:'A1',table:'A1',
  take:'A1',talk:'A1',tall:'A1',ten:'A1',tennis:'A1',terrible:'A1',then:'A1',there:'A1',thing:'A1',
  think:'A1',three:'A1',time:'A1',tired:'A1',title:'A1',today:'A1',together:'A1',too:'A1',town:'A1',
  train:'A1',trip:'A1',trousers:'A1',true:'A1',try:'A1',two:'A1',under:'A1',understand:'A1',up:'A1',
  use:'A1',very:'A1',video:'A1',village:'A1',visit:'A1',wait:'A1',wake:'A1',walk:'A1',wall:'A1',
  want:'A1',warm:'A1',wash:'A1',watch:'A1',water:'A1',we:'A1',wear:'A1',weather:'A1',website:'A1',
  week:'A1',white:'A1',who:'A1',why:'A1',win:'A1',window:'A1',wine:'A1',winter:'A1',with:'A1',
  woman:'A1',word:'A1',work:'A1',worker:'A1',world:'A1',write:'A1',year:'A1',yes:'A1',you:'A1',
  young:'A1',yourself:'A1','t-shirt':'A1',
  // A2
  abroad:'A2',accident:'A2',accommodation:'A2',according:'A2',address:'A2',adult:'A2',adventure:'A2',
  affect:'A2',afford:'A2',against:'A2',airline:'A2',alive:'A2',allow:'A2',although:'A2',amount:'A2',
  ancient:'A2',anymore:'A2',appointment:'A2',arrange:'A2',arrangement:'A2',attack:'A2',attend:'A2',
  attention:'A2',attractive:'A2',audience:'A2',average:'A2',bar:'A2',baseball:'A2',based:'A2',bean:'A2',
  bear:'A2',beat:'A2',belt:'A2',benefit:'A2',biscuit:'A2',bit:'A2',blank:'A2',blood:'A2',blow:'A2',
  board:'A2',boss:'A2',bottom:'A2',bowl:'A2',borrow:'A2',burn:'A2',camp:'A2',care:'A2',career:'A2',
  careful:'A2',carefully:'A2',cartoon:'A2',case:'A2',cash:'A2',castle:'A2',catch:'A2',cause:'A2',
  celebrate:'A2',celebrity:'A2',certain:'A2',certainly:'A2',charity:'A2',chat:'A2',chef:'A2',
  clear:'A2',clearly:'A2',clever:'A2',climate:'A2',clothing:'A2',cloud:'A2',coach:'A2',coast:'A2',
  code:'A2',collect:'A2',colleague:'A2',column:'A2',comedy:'A2',comfortable:'A2',communicate:'A2',
  community:'A2',condition:'A2',conference:'A2',connect:'A2',connected:'A2',context:'A2',correctly:'A2',
  couple:'A2',cover:'A2',crazy:'A2',creative:'A2',credit:'A2',cycle:'A2',daily:'A2',decision:'A2',
  degree:'A2',desert:'A2',designer:'A2',detective:'A2',develop:'A2',device:'A2',distance:'A2',
  document:'A2',dollar:'A1',download:'A2',drama:'A2',drawing:'A2',dream:'A2',earn:'A2',earth:'A2',
  effect:'A2',engine:'A2',engineer:'A2',excellent:'A2',except:'A2',expression:'A2',factor:'A2',
  factory:'A2',fail:'A2',fair:'A2',fear:'A2',feature:'A2',female:'A2',finally:'A2',fix:'A2',
  flat:'A2',flu:'A2',flying:'A2',focus:'A2',following:'A2',foreign:'A2',fresh:'A2',further:'A2',
  furniture:'A2',gallery:'A2',gap:'A2',gift:'A2',goal:'A2',god:'A2',gold:'A2',golf:'A2',grass:'A2',
  greet:'A2',ground:'A2',guide:'A2',gun:'A2',guy:'A2',habit:'A2',heavy:'A2',height:'A2',hide:'A2',
  identify:'A2',ideal:'A2',item:'A2',itself:'A2',jam:'A2',jazz:'A2',jewellery:'A2',joke:'A2',
  kid:'A2',laughter:'A2',law:'A2',lecture:'A2',lemon:'A2',lend:'A2',less:'A2',level:'A2',lift:'A2',
  likely:'A2',link:'A2',list:'A2',loud:'A2',lower:'A2',manage:'A2',mark:'A2',material:'A2',
  memory:'A2',mention:'A2',metal:'A2',method:'A2',middle:'A2',might:'A2',mirror:'A2',missing:'A2',
  mix:'A2',model:'A2',moment:'A2',mostly:'A2',narrow:'A2',nature:'A2',negative:'A2',normal:'A2',
  nothing:'A2',offer:'A2',opinion:'A2',option:'A2',ordinary:'A2',organization:'A2',organize:'A2',
  original:'A2',ourselves:'A2',pack:'A2',pain:'A2',palace:'A2',pants:'A2',parking:'A2',passenger:'A2',
  perhaps:'A2',permission:'A2',physical:'A2',physics:'A2',pick:'A2',pilot:'A2',pleased:'A2',
  please:'A2',positive:'A2',power:'A2',practice:'A2',preparation:'A2',prepare:'A2',present:'A2',
  price:'A2',probably:'A2',professional:'A2',professor:'A2',profile:'A2',program:'A2',protect:'A2',
  provide:'A2',queen:'A2',quantity:'A2',reach:'A2',receive:'A2',refer:'A2',region:'A2',relationship:'A2',
  remove:'A2',reply:'A2',review:'A2',rise:'A2',ring:'A2',roof:'A2',round:'A2',rubbish:'A2',rude:'A2',
  run:'A1',sauce:'A2',save:'A2',score:'A2',secret:'A2',secretary:'A2',seem:'A2',sense:'A2',serve:'A2',
  service:'A2',sheet:'A2',sign:'A2',silver:'A2',simple:'A1',skin:'A2',skiing:'A2',sky:'A2',sleep:'A1',
  smell:'A2',smile:'A2',smoke:'A2',smoking:'A2',sort:'A2',source:'A2',square:'A2',start:'A1',
  state:'A2',stay:'A1',strategy:'A2',stress:'A2',strong:'A2',style:'A2',support:'A2',suppose:'A2',
  swim:'A1',system:'A2',tablet:'A2',target:'A2',term:'A2',thousand:'A2',tip:'A2',today:'A1',
  together:'A1',trouble:'A2',truck:'A2',underground:'A2',understanding:'A2',usually:'A2',view:'A2',
  virus:'A2',wave:'A2',weak:'A2',wind:'A2',wooden:'A2',worried:'A2',worry:'A2',worse:'A2',
  zero:'A2',
  // B1
  access:'B1',account:'B1',achieve:'B1',addition:'B1',adult:'A2',ahead:'A1',aim:'B1',alarm:'B1',
  album:'B1',alcohol:'B1',alcoholic:'B1',analyse:'B1',analysis:'B1',arrest:'B1',arrival:'B1',
  atmosphere:'B1',attach:'B1',attitude:'B1',attract:'B1',attraction:'B1',bake:'B1',balance:'B1',
  ban:'B1',base:'B1',bee:'B1',bend:'B1',block:'B1',board:'A2',bother:'B1',bury:'B1',by:'B1',
  calm:'B1',campaign:'B1',cap:'B1',captain:'B1',category:'B1',celebration:'B1',ceiling:'B1',
  central:'B1',ceremony:'B1',chain:'B1',character:'B1',cheap:'A1',cheat:'B1',cheerful:'B1',
  chemical:'B1',claim:'B1',clear:'A2',click:'B1',client:'B1',cloth:'B1',clue:'B1',coal:'B1',
  coin:'B1',collection:'B1',combine:'B1',commit:'B1',communication:'B1',concentrate:'B1',conclude:'B1',
  conclusion:'B1',confident:'B1',confirm:'B1',confuse:'B1',confused:'B1',container:'B1',content:'B1',
  costume:'B1',cottage:'B1',cotton:'B1',council:'A1',count:'B1',countryside:'B1',court:'B1',
  covered:'B1',custom:'B1',cut:'A1',damage:'B1',decade:'B1',determine:'B1',determined:'B1',
  development:'B1',diagram:'B1',dislike:'B1',documentary:'B1',donate:'B1',earthquake:'B1',education:'B1',
  educational:'B1',effective:'B1',effectively:'B1',effort:'B1',embarrassed:'B1',embarrassing:'B1',
  emergency:'B1',emotion:'B1',empty:'B1',encourage:'B1',enemy:'B1',engage:'B1',engaged:'B1',
  engineering:'B1',equipment:'B1',examine:'B1',exchange:'B1',excitement:'B1',export:'B1',
  fasten:'B1',feature:'A2',file:'B1',fixed:'B1',flag:'B1',flood:'B1',flow:'B1',flour:'B1',
  fold:'B1',folk:'B1',force:'B1',frozen:'B1',fry:'B1',fuel:'B1',function:'B1',generate:'B1',
  generous:'B1',gentle:'B1',gentleman:'B1',ghost:'B1',giant:'B1',glad:'B1',global:'B1',glove:'B1',
  grade:'B1',graduate:'B1',grain:'B1',grateful:'B1',growth:'B1',guard:'B1',guilty:'B1',
  hardly:'B1',helicopter:'B1',identity:'B1',illness:'B1',imagine:'B1',improve:'B1',include:'B1',
  increase:'B1',industry:'B1',influence:'B1',information:'B1',insurance:'B1',intend:'B1',
  introduction:'B1',investigate:'B1',involve:'B1',issue:'B1',journal:'B1',keyboard:'B1',kick:'B1',
  latest:'B1',lead:'B1',leading:'B1',leaf:'B1',leather:'B1',legal:'B1',leisure:'B1',length:'B1',
  limit:'B1',medium:'B1',mental:'B1',mess:'B1',mild:'B1',northern:'B1',offer:'A2',organized:'B1',
  organizer:'B1',original:'A2',ought:'B1',ours:'B1',pack:'A2',package:'B1',painful:'B1',pale:'B1',
  pan:'B1',pass:'B1',passion:'B1',performance:'B1',photographer:'B1',photography:'B1',
  physical:'A2',pin:'B1',pipe:'B1',pleasure:'B1',plot:'B1',plenty:'B1',point:'B1',policy:'B1',
  politics:'B1',population:'B1',position:'B1',poverty:'B1',profit:'B1',proper:'B1',properly:'B1',
  property:'B1',queue:'B1',range:'B1',rare:'B1',rarely:'B1',reflect:'B1',relation:'B1',relative:'B1',
  relaxed:'B1',relaxing:'B1',remain:'B1',remind:'B1',remote:'B1',rent:'B1',repair:'B1',
  represent:'B1',resource:'B1',respect:'B1',responsibility:'B1',responsible:'B1',
  revise:'B1',risk:'B1',rope:'B1',rough:'B1',rugby:'B1',sample:'B1',sand:'B1',scientific:'B1',
  seed:'B1',sensible:'B1',set:'B1',setting:'B1',sharp:'B1',shelf:'B1',shell:'B1',shoot:'B1',
  sight:'B1',signal:'B1',silence:'B1',silent:'B1',silly:'B1',similarity:'B1',similarly:'B1',
  slice:'B1',slightly:'B1',smart:'B1',smooth:'B1',sort:'A2',spend:'A1',spicy:'B1',spirit:'B1',
  spread:'B1',stadium:'B1',standard:'B1',statistic:'B1',statue:'B1',strength:'B1',stranger:'B1',
  structure:'B1',stuff:'B1',studio:'B1',surface:'B1',surely:'B1',survive:'B1',symptom:'B1',
  tail:'B1',talent:'B1',talented:'B1',tape:'B1',tend:'B1',tent:'B1',tin:'B1',tiny:'B1',
  trick:'B1',victim:'B1',viewer:'B1',violent:'B1',warn:'B1',warning:'B1',waste:'B1',weapon:'B1',
  wing:'B1',wool:'B1',worldwide:'B1',worry:'A2',youth:'B1',
  // B2
  acceptable:'B2',accompany:'B2',achieve:'B1',affair:'B2',aid:'B2',aim:'B1',aircraft:'B2',
  alarm:'B1',amount:'A2',angle:'B2',anger:'B2',annual:'B2',anxious:'B2',attempt:'B2',attitude:'B1',
  bar:'A2',barrier:'B2',battle:'B2',bear:'A2',bite:'B1',bitter:'B2',blame:'B2',blind:'B2',
  border:'B1',bullet:'B2',bunch:'B2',bush:'B2',cable:'B2',calculate:'B2',capable:'B2',capacity:'B2',
  capture:'B2',cast:'B2',cell:'B2',chain:'B1',circumstance:'B2',cite:'B2',citizen:'B2',civil:'B2',
  classic:'B2',collapse:'B2',combination:'B2',comfort:'B2',commitment:'B2',committee:'B2',
  commonly:'B2',concentration:'B2',concept:'B2',concern:'B2',concerned:'B2',conduct:'B2',
  confidence:'B2',conflict:'B2',confusing:'B2',contemporary:'B2',contest:'B2',core:'B2',
  corporate:'B2',county:'B2',courage:'B2',crash:'B2',creation:'B2',creature:'B2',crime:'B1',
  crew:'B2',curved:'B2',debt:'B2',declare:'B2',decline:'B2',delay:'B2',deliberate:'B2',
  deliberately:'B2',delight:'B2',demonstrate:'B1',deny:'B1',deserve:'B2',desire:'B2',detect:'B2',
  disappear:'B1',display:'B2',distribute:'B2',distribution:'B2',domestic:'B2',dominate:'B2',
  dramatic:'B2',downwards:'B2',draft:'B2',drag:'B2',efficient:'B2',elsewhere:'B2',emerge:'B2',
  enable:'B2',encounter:'B2',engage:'B2',enhance:'B2',estimate:'B2',ethical:'B2',evaluate:'B2',
  evidence:'B1',exact:'B1',executive:'B2',excuse:'B2',expose:'B2',extend:'B2',extent:'B2',
  external:'B2',facility:'B2',failure:'B2',fault:'B2',fee:'B2',feed:'B1',feedback:'B2',
  feather:'B2',fellow:'B2',flame:'B2',flash:'B2',flexible:'B2',float:'B2',fund:'B2',
  fundamental:'B2',funding:'B2',furthermore:'B2',gain:'B2',gang:'B2',genre:'B2',
  government:'B1',grant:'B2',guarantee:'B2',gradually:'B2',grand:'B2',harm:'B2',harmful:'B2',
  heel:'B2',hell:'B2',hesitate:'B2',illegal:'B1',implement:'B2',impression:'B1',include:'B1',
  institution:'B1',investigation:'B1',launch:'B2',league:'B2',lean:'B2',latest:'B1',
  military:'B2',minority:'B2',minister:'B2',minor:'B2',limited:'B2',means:'B1',melt:'B2',
  medium:'B1',oppose:'B2',opposition:'B2',origin:'B2',otherwise:'B2',
  paragraph:'A1',parliament:'B2',passage:'B2',permanent:'B2',permit:'B2',phase:'B2',phenomenon:'B2',
  philosophy:'B2',pile:'B2',pitch:'B2',plain:'B2',plus:'B2',pride:'B1',principal:'B1',prison:'B1',
  proof:'B2',proposal:'B2',propose:'B2',prospect:'B2',rapid:'B2',rapidly:'B2',recover:'B2',
  reduction:'B2',reform:'B1',regional:'B2',register:'B2',remark:'B2',regard:'B2',
  relative:'B1',relatively:'B2',reputation:'B2',resort:'B2',reveal:'B2',revolution:'B2',
  reward:'B2',root:'B2',rubber:'B2',satellite:'B2',satisfied:'B2',satisfy:'B2',
  saving:'B2',scream:'B2',seek:'B2',select:'B2',selection:'B2',self:'B2',senior:'B2',
  sensitive:'B2',session:'B2',settle:'B2',shock:'B2',shocked:'B2',shooting:'B2',significant:'B2',
  significantly:'B2',silk:'B2',slave:'B2',slight:'B2',slip:'B2',slope:'B2',soul:'B2',
  spiritual:'B2',split:'B2',stable:'B2',status:'B2',stream:'B2',struggle:'B2',swear:'B2',
  sweep:'B2',tank:'B2',tale:'B2',temporary:'B2',title:'A1',tropical:'B2',
  via:'B2',violence:'B2',virtual:'B2',vision:'B2',wealth:'B2',wealthy:'B2',willing:'B2',
  victory:'B2',weakness:'B2',zone:'B2',
  // C1 (Oxford 5000 C1 words — shown in C1 + All views)
  abolish:'C1',abstain:'C1',absurd:'C1',acknowledge:'C1',acute:'C1',adapt:'C1',adequate:'C1',
  adjective:'C1',advocate:'C1',allocate:'C1',ambiguous:'C1',ambition:'C1',amend:'C1',amplify:'C1',
  analyse:'B1',anticipate:'C1',appoint:'C1',arbitrary:'C1',aspire:'C1',assertion:'C1',
  assess:'C1',assign:'C1',assumption:'C1',assure:'C1',audit:'C1',authorise:'C1',autonomous:'C1',
  biography:'C1',bureaucracy:'C1',category:'B1',clarify:'C1',classify:'C1',coherent:'C1',
  coincide:'C1',compensate:'C1',complement:'C1',comply:'C1',conceive:'C1',condemn:'C1',
  consequence:'C1',constitute:'C1',contradict:'C1',controversy:'C1',conviction:'C1',
  correlate:'C1',criteria:'C1',criticise:'C1',cultivate:'C1',currency:'C1',
  deduce:'C1',deficit:'C1',depict:'C1',derive:'C1',diagnose:'C1',differentiate:'C1',
  dilemma:'C1',diminish:'C1',diplomatic:'C1',discourse:'C1',discriminate:'C1',disperse:'C1',
  diverse:'C1',diversity:'C1',doctrine:'C1',dominate:'B2',dynamic:'C1',
  elaborate:'C1',eliminate:'C1',embassy:'C1',emphasise:'C1',empower:'C1',equivalent:'C1',
  ethic:'C1',evolve:'C1',exceed:'C1',exclude:'C1',expertise:'C1',explicit:'C1',
  facilitate:'C1',flourish:'C1',formulate:'C1',fragment:'C1',global:'B1',
  hypothesis:'C1',identify:'A2',illuminate:'C1',immense:'C1',implicit:'C1',impose:'C1',
  incentive:'C1',inevitable:'C1',infrastructure:'C1',inherent:'C1',innovation:'C1',
  insight:'C1',integrity:'C1',interpret:'C1',intervention:'C1',investigate:'B1',
  legislation:'C1',legitimate:'C1',liable:'C1',maintain:'C1',manipulate:'C1',mechanism:'C1',
  mediate:'C1',methodology:'C1',moderate:'C1',modify:'C1',monitor:'C1',motivate:'C1',
  negotiate:'C1',notion:'C1',novel:'C1',nuclear:'C1',objective:'C1',obtain:'C1',
  offset:'C1',ongoing:'C1',overcome:'C1',overlook:'C1',oversee:'C1',paralyse:'C1',
  perceive:'C1',perspective:'C1',phenomenon:'B2',possess:'C1',potential:'C1',
  precede:'C1',prejudice:'C1',premises:'C1',prescribe:'C1',prevail:'C1',priorities:'C1',
  prohibit:'C1',publicize:'C1',pursue:'C1',query:'C1',reconcile:'C1',reinforce:'C1',
  reluctant:'C1',render:'C1',resilient:'C1',resolve:'C1',restrict:'C1',reveal:'B2',
  revise:'B1',scenario:'C1',sophisticated:'C1',speculate:'C1',subsequent:'C1',
  substantial:'C1',sustain:'C1',tendency:'C1',tolerance:'C1',trigger:'C1',unanimous:'C1',
  undermine:'C1',undertake:'C1',utilize:'C1',validate:'C1',variable:'C1',whereas:'C1',

  // === EXPANDED A1 additions ===
  almost:'A1',alone:'A1',apple:'A1',cup:'A1',desk:'A1',hundred:'A1',milk:'A1',
  near:'A1',need:'A1',never:'A1',person:'A1',play:'A1',police:'A1',popular:'A1',
  possible:'A1',post:'A1',show:'A1',sick:'A1',south:'A1',sport:'A1',teach:'A1',
  travel:'A1',tree:'A1',

  // === EXPANDED A2 additions ===
  ability:'A2',action:'A2',active:'A2',annoy:'A2',author:'A2',
  avoid:'A2',belong:'A2',billion:'A2',birth:'A2',brain:'A2',choice:'A2',criminal:'A2',
  cross:'A2',crowd:'A2',cry:'A2',deal:'A2',describe:'A2',differently:'A2',digital:'A2',
  direct:'A2',double:'A2',drop:'A2',dry:'A2',enjoy:'A2',environment:'A2',even:'A2',
  exist:'A2',expect:'A2',experience:'A2',express:'A2',fail:'A2',fear:'A2',feature:'A2',
  female:'A2',fiction:'A2',field:'A2',finally:'A2',finish:'A2',fix:'A2',foreign:'A2',
  forest:'A2',formal:'A2',fortunately:'A2',forward:'A2',further:'A2',future:'A2',
  gift:'A2',goal:'A2',grass:'A2',ground:'A2',gun:'A2',guy:'A2',habit:'A2',heavy:'A2',
  hide:'A2',human:'A2',however:'A2',inside:'A2',item:'A2',itself:'A2',joke:'A2',
  journalist:'A2',kid:'A2',law:'A2',lecture:'A2',lemon:'A2',lend:'A2',less:'A2',
  level:'A2',lift:'A2',lifestyle:'A2',link:'A2',loud:'A2',manage:'A2',mark:'A2',
  material:'A2',memory:'A2',mention:'A2',metal:'A2',method:'A2',middle:'A2',mirror:'A2',
  mix:'A2',model:'A2',moment:'A2',narrow:'A2',nature:'A2',negative:'A2',normal:'A2',
  notice:'A2',offer:'A2',opinion:'A2',option:'A2',ordinary:'A2',ourselves:'A2',
  own:'A2',pain:'A2',permission:'A2',physical:'A2',pick:'A2',pilot:'A2',
  plan:'A2',pleased:'A2',practice:'A2',prepare:'A2',present:'A2',probably:'A2',
  program:'A2',progress:'A2',promise:'A2',protect:'A2',provide:'A2',quantity:'A2',
  reach:'A2',receive:'A2',region:'A2',relationship:'A2',reply:'A2',rise:'A2',
  ring:'A2',route:'A2',rude:'A2',save:'A2',score:'A2',secret:'A2',seem:'A2',
  sense:'A2',serve:'A2',service:'A2',sign:'A2',skin:'A2',sky:'A2',smell:'A2',
  smoke:'A2',social:'A2',society:'A2',soft:'A2',soldier:'A2',solution:'A2',
  solve:'A2',source:'A2',sort:'A2',special:'A2',square:'A2',state:'A2',
  store:'A2',strategy:'A2',stress:'A2',strong:'A2',support:'A2',surprise:'A2',
  survey:'A2',sweet:'A2',system:'A2',target:'A2',task:'A2',taste:'A2',term:'A2',
  tip:'A2',top:'A2',trouble:'A2',typical:'A2',unit:'A2',user:'A2',usual:'A2',
  valley:'A2',view:'A2',wave:'A2',while:'A2',wide:'A2',wood:'A2',worry:'A2',
  zero:'A2',design:'A2',differ:'A2',direction:'A2',distance:'A2',divide:'A2',
  energy:'A2',engineer:'A2',fill:'A2',fresh:'A2',hold:'A2',huge:'A2',increase:'A2',
  instruction:'A2',international:'A2',introduce:'A2',land:'A2',lead:'A2',
  local:'A2',lock:'A2',lonely:'A2',mountain:'A2',museum:'A2',object:'A2',
  path:'A2',plastic:'A2',point:'A2',power:'A2',press:'A2',product:'A2',proud:'A2',
  pull:'A2',push:'A2',realize:'A2',reason:'A2',recognize:'A2',result:'A2',
  rule:'A2',secretary:'A2',similar:'A2',situation:'A2',speed:'A2',step:'A2',
  stick:'A2',stomach:'A2',straight:'A2',strange:'A2',succeed:'A2',
  technology:'A2',truth:'A2',useful:'A2',various:'A2',village:'A2',whole:'A2',wild:'A2',

  // === EXPANDED B1 additions ===
  accept:'B1',basic:'B1',behaviour:'B1',careless:'B1',competition:'B1',doubt:'B1',
  dust:'B1',duty:'B1',event:'B1',expand:'B1',expedition:'B1',explode:'B1',
  explore:'B1',explosion:'B1',familiar:'B1',fence:'B1',fitness:'B1',honest:'B1',
  hunt:'B1',indoor:'B1',iron:'B1',judge:'B1',liquid:'B1',literature:'B1',
  mystery:'B1',nail:'B1',nation:'B1',native:'B1',needle:'B1',neighbourhood:'B1',
  nor:'B1',obvious:'B1',occasion:'B1',occur:'B1',official:'B1',persuade:'B1',
  port:'B1',portrait:'B1',pot:'B1',pour:'B1',promote:'B1',reaction:'B1',
  refuse:'B1',require:'B1',shy:'B1',software:'B1',soil:'B1',solid:'B1',
  substance:'B1',total:'B1',touch:'B1',trade:'B1',treat:'B1',volunteer:'B1',
  vote:'B1',wonder:'B1',aim:'B1',alert:'B1',avoid:'B1',block:'B1',calm:'B1',
  comment:'B1',complex:'B1',debt:'B2',effective:'B1',effort:'B1',elect:'B1',
  explore:'B1',freedom:'B1',generation:'B1',identify:'A2',image:'B1',impact:'B1',
  income:'B1',inform:'B1',invest:'B1',issue:'B1',lane:'B1',leak:'B1',load:'B1',
  logical:'B1',maintain:'B1',major:'B1',media:'B1',moral:'B1',network:'B1',
  nowhere:'B1',organize:'A2',original:'B1',particular:'B1',prevent:'B1',
  previous:'B1',prison:'B1',private:'B1',process:'B1',proper:'B1',prove:'B1',
  purpose:'B1',rapid:'B1',reduce:'B1',refer:'B1',regular:'B1',relate:'B1',
  release:'B1',rely:'B1',replace:'B1',reward:'B1',role:'B1',rush:'B1',
  specific:'B1',suggest:'B1',supply:'B1',switch:'B1',therefore:'B1',
  toward:'B1',transfer:'B1',trust:'B1',vehicle:'B1',violence:'B1',warn:'B1',
  waste:'B1',wealth:'B1',weigh:'B1',wise:'B1',
  authority:'B1',central:'B1',damage:'B1',decade:'B1',despite:'B1',
  development:'B1',difficulty:'B1',encourage:'B1',equipment:'B1',escape:'B1',
  evidence:'B1',extreme:'B1',harvest:'B1',heal:'B1',language:'A1',
  pattern:'B1',signal:'B1',

  // === MORE B1 additions ===
  background:'B1',bacteria:'B1',breathe:'B1',brilliant:'B1',
  campus:'B1',childhood:'B1',compete:'B1',conversation:'B1',
  culture:'B1',curious:'B1',danger:'B1',dangerous:'B1',data:'B1',
  deadline:'B1',detail:'B1',disaster:'B1',disease:'B1',
  drought:'B1',echo:'B1',employ:'B1',entrance:'B1',fame:'B1',
  famous:'B1',festival:'B1',fetch:'B1',fortune:'B1',gather:'B1',
  globe:'B1',gossip:'B1',hunger:'B1',hurt:'B1',ignore:'B1',
  incident:'B1',inspire:'B1',injury:'B1',jail:'B1',
  label:'B1',lazy:'B1',library:'B1',location:'B1',magic:'B1',
  mood:'B1',muscle:'B1',obey:'B1',opportunity:'B1',patience:'B1',
  perform:'B1',planet:'B1',pocket:'B1',political:'B1',pollution:'B1',
  prayer:'B1',punishment:'B1',religion:'B1',
  safety:'B1',serious:'B1',shadow:'B1',shelter:'B1',
  symbol:'B1',sympathy:'B1',teenage:'B1',thunder:'B1',topic:'B1',
  tourist:'B1',trend:'B1',ugly:'B1',umbrella:'B1',
  announce:'B1',appreciate:'B1',article:'B1',athlete:'B1',
  broadcast:'B1',challenge:'B1',champion:'B1',civilization:'B1',
  conscious:'B1',criticism:'B1',defend:'B1',determination:'B1',
  dialogue:'B1',ethnic:'B1',faith:'B1',fascinate:'B1',gender:'B1',
  heritage:'B1',homeless:'B1',horizon:'B1',humor:'B1',
  impressive:'B1',independence:'B1',individual:'B1',injustice:'B1',
  intelligence:'B1',interact:'B1',invention:'B1',
  knowledge:'B1',legacy:'B1',loyalty:'B1',
  motivation:'B1',movement:'B1',narrative:'B1',national:'B1',
  obstacle:'B1',participate:'B1',passion:'B1',persistent:'B1',
  profession:'B1',protest:'B1',
  revenge:'B1',sensation:'B1',settlement:'B1',
  stability:'B1',statistics:'B1',success:'B1',
  suffering:'B1',theory:'B1',
  transform:'B1',treatment:'B1',tribe:'B1',voyage:'B1',witness:'B1',

  // === MORE B2 additions ===
  casual:'B2',eager:'B2',ecology:'B2',era:'B2',frustration:'B2',
  govern:'B2',habitat:'B2',idiom:'B2',irony:'B2',jury:'B2',
  keen:'B2',myth:'B2',naive:'B2',possession:'B2',privacy:'B2',
  racism:'B2',radiation:'B2',rage:'B2',rally:'B2',sarcasm:'B2',
  stereotype:'B2',tactic:'B2',toxic:'B2',treaty:'B2',vaccine:'B2',
  valid:'B2',warfare:'B2',ambivalent:'B2',chaos:'B2',
  empathy:'B2',exploit:'B2',quota:'B2',regulate:'B2',
  resentment:'B2',sovereignty:'B2',speculation:'B2',wisdom:'B2',

  // === EXPANDED C1 additions ===
  abstract:'C1',abstraction:'C1',abundance:'C1',accessible:'C1',accountability:'C1',accumulate:'C1',
  accuracy:'C1',accurate:'C1',acquaint:'C1',acquisition:'C1',adjacent:'C1',administration:'C1',
  advisory:'C1',advocacy:'C1',affiliation:'C1',aftermath:'C1',agenda:'C1',agony:'C1',
  allegation:'C1',allegedly:'C1',alignment:'C1',analogy:'C1',apparatus:'C1',articulate:'C1',
  attribute:'C1',autonomy:'C1',capitalism:'C1',chronic:'C1',cognitive:'C1',collaborate:'C1',
  collaboration:'C1',compelling:'C1',competent:'C1',competence:'C1',composition:'C1',
  comprehensive:'C1',concede:'C1',concurrent:'C1',confine:'C1',consecutive:'C1',consensus:'C1',
  consolidate:'C1',constrain:'C1',construct:'C1',contemplate:'C1',conventional:'C1',
  conviction:'C1',cooperate:'C1',cooperation:'C1',coordination:'C1',counterpart:'C1',
  curriculum:'C1',debate:'C1',deception:'C1',dedicate:'C1',definitive:'C1',delegate:'C1',
  deviation:'C1',dignity:'C1',disproportionate:'C1',distinct:'C1',distinction:'C1',
  documentation:'C1',dominant:'C1',equity:'C1',exclusive:'C1',foster:'C1',framework:'C1',
  genuine:'C1',globalisation:'C1',globalization:'C1',governance:'C1',guidance:'C1',
  hierarchy:'C1',ideology:'C1',incorporate:'C1',indispensable:'C1',innovate:'C1',
  integrate:'C1',intellectual:'C1',intrinsic:'C1',justify:'C1',landmark:'C1',
  likelihood:'C1',magnitude:'C1',minimize:'C1',mobilize:'C1',morality:'C1',mutual:'C1',
  paradigm:'C1',portfolio:'C1',pragmatic:'C1',precedent:'C1',predominantly:'C1',
  profound:'C1',protocol:'C1',radical:'C1',rationale:'C1',realistic:'C1',
  rigorous:'C1',robust:'C1',scrutiny:'C1',spectrum:'C1',stimulus:'C1',subtle:'C1',
  surge:'C1',susceptible:'C1',systematic:'C1',thesis:'C1',transparency:'C1',
  underlying:'C1',validity:'C1',viable:'C1',vital:'C1',vulnerable:'C1',yield:'C1',
  absence:'C1',absorb:'C1',absorption:'C1',accelerate:'C1',acceptance:'C1',
  acknowledgement:'C1',acquittal:'C1',acute:'C1',adamant:'C1',adequate:'C1',
  adhere:'C1',adherence:'C1',adolescence:'C1',adverse:'C1',adversity:'C1',
  affirmation:'C1',affluence:'C1',affluent:'C1',aggression:'C1',aggressive:'C1',
  alienate:'C1',allegiance:'C1',alleviate:'C1',alteration:'C1',ambitious:'C1',
  anomaly:'C1',assertion:'C1',assumption:'C1',authentic:'C1',authority:'C1',
  authorization:'C1',benchmark:'C1',candid:'C1',capability:'C1',clarity:'C1',
  coherence:'C1',collaboration:'C1',collective:'C1',complement:'C1',complexity:'C1',
  conceivable:'C1',concrete:'C1',confidence:'C1',confiscate:'C1',confrontation:'C1',
  contentious:'C1',contrast:'C1',conviction:'C1',coordinate:'C1',correlation:'C1',
  credibility:'C1',credible:'C1',criterion:'C1',critical:'C1',critique:'C1',
  culminate:'C1',decipher:'C1',decisive:'C1',declaration:'C1',deference:'C1',
  deliberation:'C1',dependency:'C1',detrimental:'C1',disclose:'C1',disclosure:'C1',
  discretion:'C1',disposition:'C1',disruptive:'C1',diverge:'C1',divergence:'C1',
  dominance:'C1',duration:'C1',emergence:'C1',empirical:'C1',endorse:'C1',
  enforcement:'C1',entail:'C1',entrepreneurial:'C1',essence:'C1',ethical:'C1',
  evaluation:'C1',exacerbate:'C1',exception:'C1',execution:'C1',exhaustive:'C1',
  exploitation:'C1',extension:'C1',extent:'C1',extrinsic:'C1',

  // === EXPANDED B2 additions ===
  abandon:'B2',absolute:'B2',abuse:'B2',academic:'B2',artificial:'B2',bond:'B2',
  budget:'B2',crisis:'B2',criterion:'B2',critic:'B2',criticize:'B2',crop:'B2',
  crucial:'B2',cure:'B2',dozen:'B2',existence:'B2',expectation:'B2',faith:'B2',
  handle:'B2',honour:'B2',infection:'B2',joy:'B2',judgement:'B2',licence:'B2',
  lively:'B2',mineral:'B2',minimum:'B2',mysterious:'B2',nightmare:'B2',
  occasionally:'B2',opponent:'B2',overall:'B2',rescue:'B2',scale:'B2',
  scheme:'B2',scream:'B2',sequence:'B2',severe:'B2',solar:'B2',sponsor:'B2',
  stare:'B2',stretch:'B2',surgery:'B2',surround:'B2',suspect:'B2',threat:'B2',
  trial:'B2',universe:'B2',unknown:'B2',wage:'B2',witness:'B2',wrap:'B2',
  acid:'B2',acquire:'B2',adapt:'B2',administration:'B2',adopt:'B2',agency:'B2',
  alternative:'B2',aspect:'B2',assess:'B2',atmosphere:'B2',attach:'B2',
  attitude:'B2',aware:'B2',basis:'B2',behave:'B2',behaviour:'B2',blame:'B2',
  brief:'B2',broadcast:'B2',burden:'B2',career:'B2',category:'B2',cause:'B2',
  challenge:'B2',commercial:'B2',commission:'B2',commit:'B2',committee:'B2',
  communicate:'B2',community:'B2',consequence:'B2',consider:'B2',
  considerable:'B2',consist:'B2',construction:'B2',context:'B2',contract:'B2',
  contribute:'B2',controversial:'B2',convenient:'B2',cope:'B2',corporate:'B2',
  corruption:'B2',definition:'B2',demand:'B2',demonstrate:'B2',deny:'B2',
  department:'B2',depression:'B2',description:'B2',distinction:'B2',
  distribution:'B2',division:'B2',economy:'B2',empire:'B2',employment:'B2',
  enormous:'B2',equality:'B2',establishment:'B2',eventually:'B2',evolution:'B2',
  exception:'B2',exchange:'B2',exclude:'B2',executive:'B2',exhausted:'B2',
  expense:'B2',experiment:'B2',extremely:'B2',federal:'B2',financial:'B2',
  formation:'B2',foundation:'B2',guarantee:'B2',highlight:'B2',homeless:'B2',
  identical:'B2',illegal:'B2',image:'B2',inevitable:'B2',inflation:'B2',
  initial:'B2',instance:'B2',institution:'B2',intense:'B2',intention:'B2',
  investigation:'B2',investment:'B2',isolated:'B2',justice:'B2',labour:'B2',
  launch:'B2',layer:'B2',liberal:'B2',majority:'B2',manufacture:'B2',
  massive:'B2',mechanism:'B2',military:'B2',minority:'B2',motivation:'B2',
  neutral:'B2',numerous:'B2',organic:'B2',outcome:'B2',overwhelming:'B2',
  participation:'B2',phenomenon:'B2',politics:'B2',poverty:'B2',precise:'B2',
  priority:'B2',principle:'B2',procedure:'B2',proportion:'B2',protest:'B2',
  psychological:'B2',publish:'B2',qualify:'B2',reasonable:'B2',reform:'B2',
  refugee:'B2',regard:'B2',reject:'B2',relevant:'B2',relief:'B2',remind:'B2',
  revenue:'B2',revolution:'B2',rural:'B2',satisfy:'B2',secure:'B2',
  significant:'B2',status:'B2',strict:'B2',struggle:'B2',sufficient:'B2',
  sustainable:'B2',tension:'B2',territory:'B2',tolerance:'B2',tradition:'B2',
  transition:'B2',ultimately:'B2',unemployment:'B2',unique:'B2',urban:'B2',
  variation:'B2',vast:'B2',widespread:'B2',
  // additional B2
  capability:'B2',capacity:'B2',characteristic:'B2',circumstance:'B2',clarify:'B2',
  classify:'B2',collaborate:'B2',complementary:'B2',completion:'B2',
  confirmation:'B2',confusion:'B2',conservation:'B2',consideration:'B2',
  consistency:'B2',constant:'B2',consumption:'B2',cooperation:'B2',
  corruption:'B2',creativity:'B2',criticism:'B2',curiosity:'B2',
  declaration:'B2',defensive:'B2',demonstration:'B2',determination:'B2',
  discrimination:'B2',domination:'B2',ecosystem:'B2',efficiency:'B2',
  elimination:'B2',emotion:'B2',emphasis:'B2',empowerment:'B2',engagement:'B2',
  environment:'B2',establishment:'B2',evaluation:'B2',evolution:'B2',
  expectation:'B2',exploration:'B2',expression:'B2',fundamental:'B2',
  generation:'B2',globalisation:'B2',heritage:'B2',horizontal:'B2',
  identification:'B2',ignorance:'B2',illusion:'B2',imagination:'B2',
  implementation:'B2',implication:'B2',independence:'B2',integration:'B2',
  interaction:'B2',interpretation:'B2',isolation:'B2',justification:'B2',
  knowledge:'B2',leadership:'B2',limitation:'B2',maintenance:'B2',
  manifestation:'B2',manipulation:'B2',measurement:'B2',navigation:'B2',
  observation:'B2',opposition:'B2',orientation:'B2',overhaul:'B2',perception:'B2',
  persistence:'B2',polarization:'B2',prediction:'B2',presentation:'B2',
  preservation:'B2',priority:'B2',proficiency:'B2',progression:'B2',
  proposition:'B2',rationalization:'B2',recognition:'B2',reconstruction:'B2',
  regulation:'B2',representation:'B2',resignation:'B2',resolution:'B2',
  restoration:'B2',restriction:'B2',speculation:'B2',stabilization:'B2',
  strategy:'B2',submission:'B2',subscription:'B2',substitution:'B2',
  transformation:'B2',transportation:'B2',uncertainty:'B2',unification:'B2',
  utilization:'B2',verification:'B2',visualization:'B2',
};

// Lookup level with simple stemming fallback
function getLevel(word) {
  if (CEFR[word]) return CEFR[word];
  const w = word;

  // -s / -es / -ies plural
  if (w.endsWith('ies') && w.length > 4) { const s = w.slice(0,-3)+'y'; if (CEFR[s]) return CEFR[s]; }
  if (w.endsWith('es') && w.length > 4) { const s = w.slice(0,-2); if (CEFR[s]) return CEFR[s]; }
  if (w.endsWith('s') && w.length > 3) { const s = w.slice(0,-1); if (CEFR[s]) return CEFR[s]; }

  // -ed past tense
  if (w.endsWith('ied') && w.length > 4) { const s = w.slice(0,-3)+'y'; if (CEFR[s]) return CEFR[s]; }
  if (w.endsWith('ed') && w.length > 3) {
    const s1 = w.slice(0,-2); if (CEFR[s1]) return CEFR[s1]; // worked→work
    const s2 = w.slice(0,-1); if (CEFR[s2]) return CEFR[s2]; // baked→bake
  }

  // -ing present participle
  if (w.endsWith('ing') && w.length > 5) {
    const s1 = w.slice(0,-3); if (CEFR[s1]) return CEFR[s1]; // working→work
    const s2 = w.slice(0,-3)+'e'; if (CEFR[s2]) return CEFR[s2]; // baking→bake
    // doubled consonant: running→run
    if (w.length > 6) { const s3 = w.slice(0,-4); if (CEFR[s3]) return CEFR[s3]; }
  }

  // -ly adverb
  if (w.endsWith('ily') && w.length > 5) { const s = w.slice(0,-3)+'y'; if (CEFR[s]) return CEFR[s]; }
  if (w.endsWith('ally') && w.length > 6) { const s = w.slice(0,-2); if (CEFR[s]) return CEFR[s]; } // basically→basic
  if (w.endsWith('ly') && w.length > 4) { const s = w.slice(0,-2); if (CEFR[s]) return CEFR[s]; }

  // -er comparative / agent noun
  if (w.endsWith('er') && w.length > 4) {
    const s1 = w.slice(0,-2); if (CEFR[s1]) return CEFR[s1]; // faster→fast, teacher→teach
    const s2 = w.slice(0,-1); if (CEFR[s2]) return CEFR[s2]; // nicer→nice
  }
  // -est superlative
  if (w.endsWith('est') && w.length > 5) {
    const s1 = w.slice(0,-3); if (CEFR[s1]) return CEFR[s1];
    const s2 = w.slice(0,-2); if (CEFR[s2]) return CEFR[s2];
  }

  // -ment → base verb
  if (w.endsWith('ment') && w.length > 6) { const s = w.slice(0,-4); if (CEFR[s]) return CEFR[s]; }

  // -ation → base verb (-ate form)
  if (w.endsWith('ation') && w.length > 7) {
    const s1 = w.slice(0,-5)+'e'; if (CEFR[s1]) return CEFR[s1]; // creation→create
    const s2 = w.slice(0,-5); if (CEFR[s2]) return CEFR[s2]; // recommend→recommendation
  }
  // -ion → base verb
  if (w.endsWith('ion') && w.length > 5) { const s = w.slice(0,-3); if (CEFR[s]) return CEFR[s]; }

  // -ness → adjective
  if (w.endsWith('ness') && w.length > 6) { const s = w.slice(0,-4); if (CEFR[s]) return CEFR[s]; }

  // -ful, -less → base noun
  if (w.endsWith('ful') && w.length > 5) { const s = w.slice(0,-3); if (CEFR[s]) return CEFR[s]; }
  if (w.endsWith('less') && w.length > 6) { const s = w.slice(0,-4); if (CEFR[s]) return CEFR[s]; }

  // -able/-ible → base verb
  if (w.endsWith('able') && w.length > 6) { const s = w.slice(0,-4); if (CEFR[s]) return CEFR[s]; }
  if (w.endsWith('ible') && w.length > 6) { const s = w.slice(0,-4); if (CEFR[s]) return CEFR[s]; }

  // -al → base noun
  if (w.endsWith('ical') && w.length > 6) { const s = w.slice(0,-4); if (CEFR[s]) return CEFR[s]; } // musical→music
  if (w.endsWith('al') && w.length > 4) { const s = w.slice(0,-2); if (CEFR[s]) return CEFR[s]; } // national→nation

  // -ity → base adj
  if (w.endsWith('ity') && w.length > 5) {
    const s1 = w.slice(0,-3); if (CEFR[s1]) return CEFR[s1]; // activity→activ
    const s2 = w.slice(0,-4)+'e'; if (CEFR[s2]) return CEFR[s2]; // ability→able
  }

  // -ive → base verb
  if (w.endsWith('ive') && w.length > 5) { const s = w.slice(0,-3); if (CEFR[s]) return CEFR[s]; }

  // -en → base adj/noun
  if (w.endsWith('en') && w.length > 4) { const s = w.slice(0,-2); if (CEFR[s]) return CEFR[s]; }

  return null;
}

// Read words.js
const content = fs.readFileSync('words.js', 'utf8');

// Preserve any header comments before "const WORDS"
const headerMatch = content.match(/^([\s\S]*?)(const WORDS\s*=)/);
const header = headerMatch ? headerMatch[1] : '';

// Parse words array
let words;
try {
  // Extract array content
  const match = content.match(/const WORDS\s*=\s*(\[[\s\S]*\]);/);
  if (!match) throw new Error('Could not find WORDS array');
  words = eval(match[1]);
} catch(e) {
  console.error('Parse error:', e.message);
  process.exit(1);
}

console.log(`Loaded ${words.length} words`);

let assigned = 0;
const levelCounts = {A1:0, A2:0, B1:0, B2:0, C1:0, none:0};

// Assign levels
const updated = words.map(w => {
  const key = w.w.toLowerCase().trim();
  const level = getLevel(key);
  if (level) {
    assigned++;
    levelCounts[level]++;
    return {...w, l: level};
  } else {
    levelCounts.none++;
    return w; // no level assigned → will be C1 in the UI
  }
});

console.log(`Assigned levels to ${assigned}/${words.length} words`);
console.log('Level distribution:', levelCounts);

// Rebuild words.js
const lines = updated.map(w => {
  if (w.l) {
    return `{w:${JSON.stringify(w.w)},t:${JSON.stringify(w.t||'')},r:${JSON.stringify(w.r||'')},l:${JSON.stringify(w.l)}}`;
  } else {
    return `{w:${JSON.stringify(w.w)},t:${JSON.stringify(w.t||'')},r:${JSON.stringify(w.r||'')}}`; 
  }
});

// Find trailing code after the array (sort/dedup lines)
const trailerMatch = content.match(/\];\s*\n([\s\S]*)/);
const trailer = trailerMatch ? '\n' + trailerMatch[1] : '';

const output = `${header}const WORDS = [\n${lines.join(',\n')}\n];${trailer}`;
fs.writeFileSync('words.js', output, 'utf8');
console.log('words.js updated successfully!');
