import{r as i,o as s,c as r,a as e,b as a,F as l,e as t,d as n}from"./app.1a57bdf1.js";import{_ as h}from"./plugin-vue_export-helper.21dcd24c.js";const d={},c=e("h1",{id:"choosing-tools-for-game-boy-development",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#choosing-tools-for-game-boy-development","aria-hidden":"true"},"#"),t(" Choosing tools for Game Boy development")],-1),u=e("p",null,"This essay gives an overview of the Game Boy's capabilities, discussing the pros and cons of the available development tools, and providing a few tips to write more efficient code.",-1),m=t("Written by "),g={href:"https://github.com/ISSOtm/",target:"_blank",rel:"noopener noreferrer"},p=t("ISSOtm"),f=t(" with help from "),_={href:"https://github.com/tobiasvl",target:"_blank",rel:"noopener noreferrer"},b=t("tobiasvl"),w=t(", some updates by "),y={href:"https://github.com/bbbbbr",target:"_blank",rel:"noopener noreferrer"},v=t("bbbbbr"),k=t("."),B=e("hr",null,null,-1),G=e("p",null,"In the past few years as retro gaming has grown in popularity, programming for older platforms has also gained traction. A popular platform is the Game Boy, both for its nostalgia and (relative) ease to program for.",-1),S={class:"custom-container warning"},M=e("p",{class:"custom-container-title"},"WARNING",-1),C=e("p",null,"This document only applies to the Game Boy and Game Boy Color. Game Boy Advance programming has little in common with Game Boy programming.",-1),A=t("If you want to program for the GBA, which is much more C-friendly (and C++ and Rust, for that matter) than the GB and GBC, then I advise you to download devkitARM and follow the "),x={href:"https://www.coranac.com/tonc/text/",target:"_blank",rel:"noopener noreferrer"},I=t("Tonc"),D=t(" tutorial. Please note that the Game Boy Advance also functions as a Game Boy Color, so if you only have a GBA, you can use it for both GB and GBC development."),R=n('<p>When someone wants to make their own game, one of the first problems they will encounter is picking the <em>tools</em> they will use. There current main options are:</p><ul><li>RGBDS (Rednex Game Boy Development System) and the Game Boy&#39;s Assembly language (ASM)</li><li>GBDK-2020 (Game Boy Development Kit) and the C language</li><li>ZGB (an engine built on GBDK-2020) and the C language</li><li>GB Studio (a drag-and-drop game creator with scripting)</li></ul><p>The purpose of this document is to provide some insights and help you make the better choice if you&#39;re starting a new project. I will also provide some &quot;good practice&quot; tips, both for C and ASM, if you have already made up your mind or are already using one of these.</p><h1 id="overview" tabindex="-1"><a class="header-anchor" href="#overview" aria-hidden="true">#</a> Overview</h1><p>The original Game Boy, codenamed the DMG, has a 1 MHz CPU [the CPU is actually clocked at 4 MHz, but every instruction takes up a multiple of 4 clocks, so it&#39;s often simplified to a 1 MHz CPU]. Given that an instruction takes approximately 2 to 3 cycles, this gives the CPU a capacity of 333,000~500,000 instructions per second. Its LCD boasts 60 fps [it&#39;s actually 59.73 fps], which rounds up to between 50,000 and 80,000 instructions per frame. Suddenly not so much, eh? It also has 8 kB of RAM, and 8 kB of video RAM ; a 160x144 px LCD (thus slightly wider than it&#39;s tall), 4 colors, and 4-channel audio.</p><p>The Super Game Boy adds a few minor things, such as a customizable screen border, and some crude color. It&#39;s also slightly faster than the DMG.</p><p>The Game Boy Color <em>can</em> [if you tell it to] unlock additional functionality, such as more fleshed-out color, a double-speed CPU, twice the video RAM and <em>four times</em> the RAM! (With caveats, obviously.)</p><h1 id="languages" tabindex="-1"><a class="header-anchor" href="#languages" aria-hidden="true">#</a> Languages</h1><p>The choice of programming language is important and can have a very large effect on a project. It determines how much work is involved, what will be possible, and how fast it will be able to run.</p><h3 id="assembly-asm" tabindex="-1"><a class="header-anchor" href="#assembly-asm" aria-hidden="true">#</a> Assembly (ASM)</h3><p>Most games and programs for the Game Boy written in ASM will use RGBDS or WLA-DX.</p><p>Strengths:</p><ul><li>Not too difficult to learn.</li><li>Extremely powerful and flexible.</li><li>When well written it allows for maximum speed and efficiency on the limited resources of the Game Boy hardware.</li></ul><p>Weaknesses:</p><ul><li>It takes a special kind of work to write optimized ASM code.</li><li>It&#39;s quite verbose and sometimes tedious.</li><li>Will require more time and learning to get up and running when compared with C.</li><li>Code may not be easily shared with ports of a game on other platforms.</li></ul><h3 id="c" tabindex="-1"><a class="header-anchor" href="#c" aria-hidden="true">#</a> C</h3>',16),T=t("C will typically be used with the SDCC compiler and GBDK-2020 or ZGB, though it can also be used on it\u2019s own without a framework or with a different compiler/dev kit (such as "),z={href:"https://github.com/z88dk/",target:"_blank",rel:"noopener noreferrer"},W=t("z88dk"),O=t(")."),P=n('<p>Strengths:</p><ul><li>Allows for getting up and running faster than with ASM, especially when building on top of GBDK-2020 and ZGB.</li><li>The language abstractions make it relatively easy to implement ideas and algorithms.</li><li>C source debugging is available through Emulicious with the VSCode debug adapter, making it easier to understand problems if they arise.</li><li>ASM can be included in projects with C, either standalone or inline for speed critical features.</li></ul><p>Weaknesses:</p><ul><li>The SDCC C compiler won&#39;t always generate code that runs as fast as skilled, hand-optimized assembly. It has matured a lot in the 20 years since the original GBDK, but bugs still turns up on occasion. On a platform with a slow CPU such as the Game Boy this can be a factor.</li><li>It\u2019s easier to write inefficient code in C without realizing it. The Game Boy&#39;s CPU is only capable of performing 8-bit addition or subtraction, or 16-bit addition. Using <code>INT32</code>s is quite taxing on the CPU (it needs to do two consecutive 16-bit adds, and add the carry). See the tips below to avoid such blunders.</li><li>There is overhead due to C being a stack-oriented language, whereas the Game Boy&#39;s CPU is rather built for a register-oriented strategy. This most notably makes passing function arguments a lot slower, although SDCC has some optimizations for this.</li></ul><h3 id="non-programming-language-option" tabindex="-1"><a class="header-anchor" href="#non-programming-language-option" aria-hidden="true">#</a> Non-Programming Language option</h3><p>Using a GUI instead- If you don\u2019t want to learn a programming language in order to make Game Boy games, then GB Studio is an option. See the <a href="#gb-studio">GB Studio</a> section for more details.</p><h1 id="development-platforms" tabindex="-1"><a class="header-anchor" href="#development-platforms" aria-hidden="true">#</a> Development Platforms</h1>',7),K={id:"rgbds-with-asm",tabindex:"-1"},q=e("a",{class:"header-anchor",href:"#rgbds-with-asm","aria-hidden":"true"},"#",-1),E=t(),L={href:"http://github.com/rednex/rgbds",target:"_blank",rel:"noopener noreferrer"},N=t("RGBDS"),U=t(" with ASM"),V=e("p",null,"RGBDS is an actively maintained suite of programs that allow building a ROM using ASM (assembly). It contains three programs that perform different stages of the compilation, as well as a program that converts PNG images to the Game Boy's tile format. RGBDS is available for Linux, Windows and MacOS.",-1),j=e("p",null,"Strengths:",-1),Z=e("ul",null,[e("li",null,"Very knowledgeable community with a lot of history."),e("li",null,"Built in support for ROM banking."),e("li",null,"Works quite well with BGB for debugging.")],-1),F=e("p",null,"Weaknesses:",-1),H=e("ul",null,[e("li",null,"Provides a limited amount of built-in code and functionality (does not include a large API like GBDK-2020 does).")],-1),Y={id:"wla-dx-with-asm",tabindex:"-1"},X=e("a",{class:"header-anchor",href:"#wla-dx-with-asm","aria-hidden":"true"},"#",-1),J=t(),Q={href:"https://github.com/vhelin/wla-dx",target:"_blank",rel:"noopener noreferrer"},$=t("WLA-DX"),ee=t(" with ASM"),te=e("p",null,"WLA-DX is also sometimes used when writing in ASM, mostly due to its better struct support than RGBDS.",-1),oe={id:"gbdk-2020-with-c",tabindex:"-1"},ae=e("a",{class:"header-anchor",href:"#gbdk-2020-with-c","aria-hidden":"true"},"#",-1),ne=t(),ie={href:"https://github.com/Zal0/gbdk-2020",target:"_blank",rel:"noopener noreferrer"},se=t("GBDK-2020"),re=t(" with C"),le=t("GBDK-2020 is a development kit and toolchain built around the SDCC C compiler which allows you to write programs in C and build ROMs. It includes an API for interfacing with the Game Boy. GBDK-2020 is a modernized version of the original "),he={href:"http://gbdk.sourceforge.net",target:"_blank",rel:"noopener noreferrer"},de=t("GBDK"),ce=t(". It's available for Linux, Windows and MacOS."),ue=e("p",null,"Strengths:",-1),me=e("ul",null,[e("li",null,"Flexible and extensible."),e("li",null,"Comprehensive API that covers most hardware features."),e("li",null,"Many sample projects and open source games are available that demonstrate how to use the API, hardware, and structure games."),e("li",null,"C source debugging is available with Emulicious.")],-1),ge=e("p",null,"Weaknesses:",-1),pe=e("ul",null,[e("li",null,"Takes care of some aspects of the hardware without requiring the developer to initiate them (such as OAM DMA during VBLANK), so it's not always obvious to beginners what the hardware is doing behind the scenes, or how to fix them when something goes wrong."),e("li",null,"ROM banking may require more management in code than RGBDS.")],-1),fe={id:"zgb-with-c-gbdk-2020",tabindex:"-1"},_e=e("a",{class:"header-anchor",href:"#zgb-with-c-gbdk-2020","aria-hidden":"true"},"#",-1),be=t(),we={href:"https://github.com/Zal0/ZGB/",target:"_blank",rel:"noopener noreferrer"},ye=t("ZGB"),ve=t(" with C & GBDK-2020"),ke=e("p",null,"ZGB is a small engine for the Game Boy built on top of GBDK-2020 and written in C. Strengths:",-1),Be=e("ul",null,[e("li",null,"The basic graphics, sound and event structure are all pre-written, so it\u2019s faster and easier to start writing a game."),e("li",null,"Several open source games built with it are available as examples.")],-1),Ge=e("p",null,"Weaknesses:",-1),Se=e("ul",null,[e("li",null,"The engine just has the basics and custom code may need to be needed for common game features (such as moving platforms, etc.)."),e("li",null,"Even more of the hardware configuration and processing is taken care of behind the scenes than with GBDK, so less experienced users may have trouble when problems arise.")],-1),Me={id:"gb-studio",tabindex:"-1"},Ce=e("a",{class:"header-anchor",href:"#gb-studio","aria-hidden":"true"},"#",-1),Ae=t(),xe={href:"https://www.gbstudio.dev/",target:"_blank",rel:"noopener noreferrer"},Ie=t("GB Studio"),De=n('<p>GB Studio is a drag-and-drop game creator for the Game Boy that does not require knowledge of programming languages. Games are built using a graphical interface to script graphics, sound and actions. It is available for Linux, Windows and MacOS.</p><p>Strengths:</p><ul><li>Very easy for beginners to start building games right away. Everything is built-in and requires minimal knowledge and understanding of the Game Boy hardware.</li><li>Has been used to create large and extensive projects.</li><li>Very active community for help and support.</li></ul><p>Weaknesses:</p><ul><li>It\u2019s games will tend to be slower than both ASM and C.</li><li>There is a limited set of commands to script with and some artificially smaller restrictions on palettes, sprites, background tiles and other hardware features (due to how GB Studio manages them).</li><li>Games may be more constrained or require workarounds to do things if they don\u2019t easily fit within the available scripting, graphics and sound tools. (Though it is possible for advanced users to do a \u201Cengine eject\u201D and add more functionality using C and ASM.)</li></ul><h1 id="emulators-and-debuging-tools" tabindex="-1"><a class="header-anchor" href="#emulators-and-debuging-tools" aria-hidden="true">#</a> Emulators and debuging tools</h1><p>Accurate emulators and debugging tools are tremendously helpful for testing and tracking down problems. The following Game Boy emulators provide excellent accuracy and include a variety of different features.</p>',7),Re={href:"http://bgb.bircd.org",target:"_blank",rel:"noopener noreferrer"},Te=t("BGB"),ze=t(" has a convenient (ASM) debugger, though its minimal interface can be confusing at first. It is available for Windows only, but runs almost flawlessly with Wine."),We={href:"https://emulicious.net/",target:"_blank",rel:"noopener noreferrer"},Oe=t("Emulicious"),Pe=t(" includes powerful tools such as a profiler and source-level debugging for ASM and C via a "),Ke={href:"https://marketplace.visualstudio.com/items?itemName=emulicious.emulicious-debugger",target:"_blank",rel:"noopener noreferrer"},qe=t("VS Code debug adapter"),Ee=t(". It runs on Linux, Windows, MacOS and any other operating systems that supports Java SE."),Le={href:"https://sameboy.github.io/features/",target:"_blank",rel:"noopener noreferrer"},Ne=t("Same Boy"),Ue=t(" is user friendly and has a wide range of powerful (ASM) debugging features. It runs on Windows and MacOS."),Ve={href:"http://github.com/sinamas/gambatte",target:"_blank",rel:"noopener noreferrer"},je=t("Gambatte"),Ze=t(" lacks a debugger and must be compiled from source, but is packaged both in "),Fe={href:"http://retroarch.com",target:"_blank",rel:"noopener noreferrer"},He=t("RetroArch"),Ye=t(" (Linux, Windows and Mac) and "),Xe={href:"http://tasvideos.org/BizHawk.html",target:"_blank",rel:"noopener noreferrer"},Je=t("BizHawk"),Qe=t(" (Windows-only)."),$e=t("Purists prefer to also run their games on hardware, which is possible thanks to flashcarts. My personal recommendation is "),et={href:"http://krikzz.com/store/",target:"_blank",rel:"noopener noreferrer"},tt=t("krikzz's carts"),ot=t(", particularly the "),at={href:"https://krikzz.com/store/home/47-everdrive-gb.html",target:"_blank",rel:"noopener noreferrer"},nt=t("Everdrive GB X5"),it=t("."),st=n('<p>Side note : if you are using VBA or VBA-rr, <strong>stop using them right now</strong>. These emulators are extremely inaccurate, and also contain <strong>severe security flaws</strong>. I strongly urge you to ditch these emulators and spread the word.</p><h1 id="summary" tabindex="-1"><a class="header-anchor" href="#summary" aria-hidden="true">#</a> Summary</h1><p>If your question is &quot;<em>What should I use for my game project ?</em>&quot;, then you&#39;re in the right section. The first question you should ask yourself is what languages you know.</p><h3 id="if-you-don-t-know-asm-c-or-c" tabindex="-1"><a class="header-anchor" href="#if-you-don-t-know-asm-c-or-c" aria-hidden="true">#</a> If you don&#39;t know ASM, C or C++</h3><p>Consider starting with C and GBDK. This will introduce you to working with the hardware and is an easier starting place.</p>',5),rt=t(`Once you've grasped C's concepts (most importantly pointers), give ASM a go. The language is simpler than it looks. Even if you don't manage to get working ASM code, it actually helps a lot (especially on such a constrained system) to know what's "under the hood". There is even an `),lt={href:"https://daid.github.io/rgbds-live/",target:"_blank",rel:"noopener noreferrer"},ht=t("online IDE"),dt=t(" to experiment with."),ct=n('<p>For C / GBDK users, knowing ASM will help you understand what it&#39;s API (which is mostly written in ASM) is doing behind the scenes and will make using emulator debuggers easier to understand.</p><p>If you don&#39;t wan&#39;t to learn a language at all, <a href="#gb-studio">GB Studio</a> is an alternative to C and ASM.</p><h3 id="if-you-know-c-but-not-asm" tabindex="-1"><a class="header-anchor" href="#if-you-know-c-but-not-asm" aria-hidden="true">#</a> If you know C but not ASM</h3><p>Consider the goals, scope and time frame of your project. If you&#39;d like to start building right away then C and GBDK will make that easy. You&#39;ll also have growing exposure to ASM as time goes on due to working with the hardware and tracking down problems in the debugger.</p><p>On the other hand, if you&#39;d like to expand your programming skill set and have additional time, learning to use ASM and RGBDS will provide you with a lot of knowledge about the Game Boy hardware. Once you know ASM in addition to C, you&#39;ll have a lot of flexibility in what tools you use for projects.</p><h3 id="if-you-know-asm" tabindex="-1"><a class="header-anchor" href="#if-you-know-asm" aria-hidden="true">#</a> If you know ASM</h3><p>RGBDS with ASM is a solid option. You&#39;ll be able to get the best performance out of the hardware, and there is an experienced community available to help.</p><p>Another option is to <a href="#community-and-help">reach out to us</a>, and discuss the matter.</p><h1 id="tips-for-better-code" tabindex="-1"><a class="header-anchor" href="#tips-for-better-code" aria-hidden="true">#</a> Tips For Better Code</h1>',9),ut=t("The "),mt=e("em",null,"very first thing",-1),gt=t(" to do "),pt=e("strong",null,"in all cases",-1),ft=t(" is to "),_t={href:"https://gbdev.io/pandocs/",target:"_blank",rel:"noopener noreferrer"},bt=t("read the docs"),wt=t(", to grasp how the Game Boy works. In ASM, this is essential; in C, this will let you understand what a given library function does. It will also let you understand what is possible on the Game Boy, and what isn't. (You can always ask, if you have doubts.)"),yt=t("I also recommend looking up "),vt={href:"https://gbdev.io/list.html",target:"_blank",rel:"noopener noreferrer"},kt=t("awesome-gbdev"),Bt=t(" for resources and tutorials. There are a lot of helpful articles there, as well as helper tools."),Gt=n('<h2 id="asm-help" tabindex="-1"><a class="header-anchor" href="#asm-help" aria-hidden="true">#</a> ASM Help</h2><ul><li><em>Modules</em><br> Separate your game into several &quot;entities&quot; that interact together. Camera, Player, NPCs, Loading zones, etc. This simplifies coding, by allowing you to reason independently on smaller units. This facilitates development and reduces the amount of bugs.</li><li><em>Document your functions</em><br> For each function, write a comment saying what it does, what memory it touches, and what registers it affects. This will avoid conflicts, and let you optimize your code by minimizing the amount of registers you save when calling a function.</li><li><em>Plan before writing</em><br> You should plan what register is going to be used for what within your functions <em>before starting to write them</em>. Your goal is to minimize the amount of register swapping. There&#39;s no general rule, so feel free to drop by and ask us, if you&#39;re in doubt.</li><li><em>RGBASM <code>-E</code> and RGBLINK <code>-n &lt;symfile&gt;</code></em><br> When you load <code>ROM.gb</code> or <code>ROM.gbc</code> in BGB, it automatically loads (if it exists) the file <code>ROM.sym</code> in the same folder as the ROM. This adds symbols to the debugger, which - believe me - helps <em>a ton</em>.</li></ul><h2 id="optimizing-for-gbdk" tabindex="-1"><a class="header-anchor" href="#optimizing-for-gbdk" aria-hidden="true">#</a> Optimizing For GBDK</h2><ul><li><em>Global variables</em><br> Use as many global variables as you can; the Game Boy has a lot of RAM compared to other platforms such as the NES, but is slow at using the stack. Thus, minimizing the number of local variables, especially in heavily-called functions, will reduce the time spent manipulating the stack.</li><li><em>Optimized code</em><br> Write code as efficient as possible. Sometimes there is a readability tradeoff, so I recommend you get the comment machine gun out and put some everywhere.</li><li>By default GBDK-2020 (after v4.0.1) will use the SDCC flag <code>--max-allocs-per-node 50000</code> for an increased optimization pass. You may also choose to use --opt-code-speed (optimize code generation towards fast code, possibly at the expense of codesize) or --opt-code-size (optimize code generation towards compact code, possibly at the expense of codespeed).</li><li><em>Inlining</em><br> When performance is important avoid using functions if you can inline them, which skips passing all arguments to the stack, mostly. Macros will be your friends there. If needed you can also use inline ASM.</li><li><strong>NEVER use recursive functions</strong></li><li><strong>AVOID printf</strong><br><code>printf</code> clobbers a sizeable chunk of VRAM with unnecessary text tiles. Instead, you should <code>sprintf</code> to a buffer in WRAM, then put that on the screen using a custom font.</li><li><em>Geometry funcs</em><br> Avoid the functions that draw geometry on-screen (lines, rectangles, etc.). The Game Boy isn&#39;t designed for this kind of drawing method, and you will have a hard time mixing this with, say, background art. Plus, the functions are super slow.</li><li><code>const</code> (very important!)<br> Declaring a variable that doesn&#39;t change as <code>const</code> <strong>greatly</strong> reduces the amount of ROM, RAM, and CPU used.<br> The technical reason behind that is that non-<code>const</code> values, <em>especially</em> arrays, are loaded to RAM from ROM in an <em>extremely</em> inefficient way. This takes up a LOT more ROM, and copies the value(s) to RAM when it&#39;s unneeded. (And the GB does not have enough RAM for that to be viable.)</li><li><em>Don&#39;t use MBC1</em><br> MBC1 is often assumed to be the simplest of all MBCs... but it has a quirk that adds some overhead every time ROM or SRAM bank switches are performed. MBC3 and MBC5 don&#39;t have this quirk, and don&#39;t add any complexity. Using MBC1 has no real use. (Let&#39;s not talk about MBC2, either.)</li></ul><h1 id="community-and-help" tabindex="-1"><a class="header-anchor" href="#community-and-help" aria-hidden="true">#</a> Community And Help</h1><p>If you want to get help from the community, go:</p>',6),St=t("To the historical IRC channel, #gbdev on "),Mt={href:"http://efnet.net",target:"_blank",rel:"noopener noreferrer"},Ct=t("EFNet"),At=t(` [if you don't have an IRC client, you can use the "Webchat login" box, just enter a username].`),xt=t("To the more recent "),It={href:"https://gbdev.io/chat.html",target:"_blank",rel:"noopener noreferrer"},Dt=t("gbdev Discord server"),Rt=t(" or "),Tt={href:"https://github.com/Zal0/gbdk-2020#discord-servers",target:"_blank",rel:"noopener noreferrer"},zt=t("GBDK/ZGB"),Wt=t(" specific server."),Ot=t("And to the "),Pt={href:"http://gbdev.gg8.se/forums",target:"_blank",rel:"noopener noreferrer"},Kt=t("GBDev forums"),qt=t("!");function Et(Lt,Nt){const o=i("ExternalLinkIcon");return s(),r(l,null,[c,u,e("p",null,[m,e("a",g,[p,a(o)]),f,e("a",_,[b,a(o)]),w,e("a",y,[v,a(o)]),k]),B,G,e("div",S,[M,C,e("p",null,[A,e("a",x,[I,a(o)]),D])]),R,e("p",null,[T,e("a",z,[W,a(o)]),O]),P,e("h3",K,[q,E,e("a",L,[N,a(o)]),U]),V,j,Z,F,H,e("h3",Y,[X,J,e("a",Q,[$,a(o)]),ee]),te,e("h3",oe,[ae,ne,e("a",ie,[se,a(o)]),re]),e("p",null,[le,e("a",he,[de,a(o)]),ce]),ue,me,ge,pe,e("h3",fe,[_e,be,e("a",we,[ye,a(o)]),ve]),ke,Be,Ge,Se,e("h3",Me,[Ce,Ae,e("a",xe,[Ie,a(o)])]),De,e("ul",null,[e("li",null,[e("p",null,[e("a",Re,[Te,a(o)]),ze])]),e("li",null,[e("p",null,[e("a",We,[Oe,a(o)]),Pe,e("a",Ke,[qe,a(o)]),Ee])]),e("li",null,[e("p",null,[e("a",Le,[Ne,a(o)]),Ue])]),e("li",null,[e("p",null,[e("a",Ve,[je,a(o)]),Ze,e("a",Fe,[He,a(o)]),Ye,e("a",Xe,[Je,a(o)]),Qe])]),e("li",null,[e("p",null,[$e,e("a",et,[tt,a(o)]),ot,e("a",at,[nt,a(o)]),it])])]),st,e("p",null,[rt,e("a",lt,[ht,a(o)]),dt]),ct,e("p",null,[ut,mt,gt,pt,ft,e("a",_t,[bt,a(o)]),wt]),e("p",null,[yt,e("a",vt,[kt,a(o)]),Bt]),Gt,e("ul",null,[e("li",null,[St,e("a",Mt,[Ct,a(o)]),At]),e("li",null,[xt,e("a",It,[Dt,a(o)]),Rt,e("a",Tt,[zt,a(o)]),Wt]),e("li",null,[Ot,e("a",Pt,[Kt,a(o)]),qt])])],64)}var jt=h(d,[["render",Et]]);export{jt as default};
