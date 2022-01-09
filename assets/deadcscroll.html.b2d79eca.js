import{r as o,o as l,c as r,a as s,b as a,F as i,e,d as t}from"./app.e8c3e902.js";import{_ as c}from"./plugin-vue_export-helper.21dcd24c.js";var p="/deadcscroll/gif//xsine.gif",h="/deadcscroll/gif//ysine.gif",d="/deadcscroll/gif//xysine.gif",f="/deadcscroll/gif//smearon.gif",u="/deadcscroll/gif//smearoff.gif",b="/deadcscroll/gif//rollon.gif",m="/deadcscroll/gif//rolloff.gif";const y={},g=s("h1",{id:"dead-c-scroll",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#dead-c-scroll","aria-hidden":"true"},"#"),e(" Dead C Scroll")],-1),w=s("p",null,"Written by Bob.",-1),_=s("hr",null,null,-1),E=s("p",null,"An assembly tutorial for Game Boy showing how the scroll registers can be exploited to create some nice and interesting effects.",-1),F=e("Files related to this tutorial can be found "),D={href:"https://github.com/gbdev/gbdev.github.io/tree/dev/list/.vuepress/public/deadcscroll",target:"_blank",rel:"noopener noreferrer"},v=e("here"),k=e("."),x=t(`<h2 id="introducing-the-registers" tabindex="-1"><a class="header-anchor" href="#introducing-the-registers" aria-hidden="true">#</a> Introducing the registers</h2><h3 id="scy-ff42-scx-ff43" tabindex="-1"><a class="header-anchor" href="#scy-ff42-scx-ff43" aria-hidden="true">#</a> SCY ($FF42)/SCX ($FF43)</h3><p>The <code>SCY</code>/<code>SCX</code> registers have a simple purpose: specify the coordinate of the screen&#39;s top-left pixel (or view, if you prefer) somewhere on the 256x256 pixel background map. This is really handy for certain kinds of games like platformers or top-down racing games (though there are LOTS of other kinds of games that benefit from this) where the view is the &#39;camera&#39; and its position is set once per frame.</p><p>When you don&#39;t require scrolling, and when your cart boots, <code>SCY</code>/<code>SCX</code> is typically set to 0,0. When a screen is displayed, it appears normally even though you only set the values once. This is because as the screen draws, the PPU automatically adds the value in <code>LY</code> ($FF44) to the value in <code>SCY</code> in order to know what row of pixels to draw.</p><div class="language-text ext-text"><pre class="shiki" style="background-color:#2e3440ff;"><code><span class="line"><span style="color:#d8dee9ff;">SCY value (set once)
\u2502
\u2502      screen
\u2502     \u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
\u2514\u2500$00 \u2502Line 0 \u2502  VRAM row $00 ($00+$00) is displayed
      \u2502Line 1 \u2502  VRAM row $01 ($00+$01) is displayed
      \u2502Line 2 \u2502  VRAM row $02 ($00+$02) is displayed
      \u2502Line 3 \u2502  VRAM row $03 ($00+$03) is displayed
      \u2502Line 4 \u2502  VRAM row $04 ($00+$04) is displayed
      \u2502...    \u2502  ...
      \u2502       \u2502
      \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518
</span></span></code></pre></div><p>If <code>SCY</code> = $20 (for example):</p><div class="language-text ext-text"><pre class="shiki" style="background-color:#2e3440ff;"><code><span class="line"><span style="color:#d8dee9ff;">SCY value (set once)
\u2502
\u2502      screen
\u2502     \u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
\u2514\u2500$20 \u2502Line 0 \u2502  VRAM row $20 ($20+$00) is displayed
      \u2502Line 1 \u2502  VRAM row $21 ($20+$01) is displayed
      \u2502Line 2 \u2502  VRAM row $22 ($20+$02) is displayed
      \u2502Line 3 \u2502  VRAM row $23 ($20+$03) is displayed
      \u2502Line 4 \u2502  VRAM row $24 ($20+$04) is displayed
      \u2502...    \u2502  ...
      \u2502       \u2502
      \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518
</span></span></code></pre></div><p>You can take advantage of how the PPU renders the screen by setting these registers <em>as the screen draws</em>. If you do this, you can create some interesting &#39;raster&#39; effects that are presented here.</p><p>As an example, let&#39;s say you wanted to triple line 0 and show it for line 0, line 1, and line 2, and then continue with line 3. You would write to the <code>SCY</code> register like so:</p><div class="language-text ext-text"><pre class="shiki" style="background-color:#2e3440ff;"><code><span class="line"><span style="color:#d8dee9ff;">SCY value (set once per line)
\u2502
\u2502      screen
\u2502     \u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
\u251C\u2500$00 \u2502Line 0 \u2502  VRAM row $00 ($00+$00) is displayed
\u251C\u2500$FF \u2502Line 1 \u2502  VRAM row $00 ($FF+$01) is displayed
\u251C\u2500$FE \u2502Line 2 \u2502  VRAM row $00 ($FE+$02) is displayed
\u251C\u2500$00 \u2502Line 3 \u2502  VRAM row $03 ($00+$03) is displayed
\u251C\u2500$00 \u2502Line 4 \u2502  VRAM row $04 ($00+$04) is displayed
\u251C\u2500... \u2502...    \u2502  ...
      \u2502       \u2502
      \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518
</span></span></code></pre></div><p>When setting values for <code>SCY</code>, you need to remember that <code>LY</code> always (and automatically) increments, so you have to account for that in your new <code>SCY</code> value. You can write anything to <code>SCX</code>; that&#39;s not affected by the hardware so you don&#39;t have to adjust the value like you need to for <code>SCY</code>.</p><blockquote><p>Note: The scroll registers only affect background rendering. They do not change how objects are displayed.</p></blockquote><h2 id="implementation" tabindex="-1"><a class="header-anchor" href="#implementation" aria-hidden="true">#</a> Implementation</h2><p>There are three main states that drive the display on the Game Boy: the Horizontal Blank (HBlank), the Vertical Blank (VBlank), and drawing. The HBlank starts when a line of pixels is completely drawn. There is an opportunity to do some work* before the next line of pixels starts drawing, and there is one HBlank for every line, all the way down the screen.</p>`,14),B=e("*"),T=e("The exact amount of time you have depends on several things; most notably how many objects are being drawn on that line. The "),$={href:"https://gbdev.io/pandocs/#pixel-fifo",target:"_blank",rel:"noopener noreferrer"},A=e("PanDocs"),C=e(" has a detailed explanation of the timing. (Indeed, read that entire document because it's great!)"),S=t(`<p>When all of the lines are completely drawn, the VBlank starts. This interval is always 10 lines high so there is much more time to do some work compared to the HBlank. The VBlank is only secondary to this system though; the focus is the HBlank since we want to change the screen as it draws. The problem that needs to be solved is reliably knowing what value to set for a specific line.</p><p>As previously mentioned, there is a small amount of time that HBlanks give you to do work. This means that the handler has to be as fast as possible. On a limited system like the Game Boy, that usually equates to judicious use of table lookups and buffers.</p><p>There are two key elements to make this system very stable and very fast:</p><ol><li>A double-buffering system that holds the data that feeds the HBlank handler</li><li>How the buffers are arranged</li></ol><h3 id="double-buffering" tabindex="-1"><a class="header-anchor" href="#double-buffering" aria-hidden="true">#</a> Double Buffering</h3><p>The idea of the double-buffer is that while one buffer is being used by the hardware to draw the screen, you modify (fill) values in the other. When the screen is done drawing, you switch buffers so the one you were just modifying is being used for drawing and you start modifying the other.</p><p>While the Draw Buffer (A) is used to render the screen, you change values in the Fill Buffer (B).</p><div class="language-text ext-text"><pre class="shiki" style="background-color:#2e3440ff;"><code><span class="line"><span style="color:#d8dee9ff;">\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510   \u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
\u2502Draw   \u2502   \u2502Fill   \u2502
\u2502Buffer \u2502   \u2502Buffer \u2502
\u2502       \u2502   \u2502       \u2502
\u2502       \u2502   \u2502       \u2502
\u2502       \u2502   \u2502       \u2502
\u2502       \u2502   \u2502       \u2502
\u2502A      \u2502   \u2502B      \u2502
\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518   \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518
</span></span></code></pre></div><p>When the screen is done being drawn (and you know this because the VBlank interrupt would have triggered or the value in <code>LY</code> changed to 144), you switch the buffers.</p><div class="language-text ext-text"><pre class="shiki" style="background-color:#2e3440ff;"><code><span class="line"><span style="color:#d8dee9ff;">\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510   \u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
\u2502Fill   \u2502   \u2502Draw   \u2502
\u2502Buffer \u2502   \u2502Buffer \u2502
\u2502       \u2502   \u2502       \u2502
\u2502       \u2502   \u2502       \u2502
\u2502       \u2502   \u2502       \u2502
\u2502       \u2502   \u2502       \u2502
\u2502A      \u2502   \u2502B      \u2502
\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518   \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518
</span></span></code></pre></div><p>Here, &quot;switch buffers&quot; means to switch the <em>purpose</em> of each buffer. It doesn&#39;t mean to copy buffers. Remember, we need this to be as fast as possible so to change buffers, you simply change pointers:</p><div class="language-text ext-text"><pre class="shiki" style="background-color:#2e3440ff;"><code><span class="line"><span style="color:#d8dee9ff;">Draw--&gt;\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510   Fill--&gt;\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
Ptr    \u2502Buffer \u2502   Ptr    \u2502Buffer \u2502
       \u2502A      \u2502          \u2502B      \u2502
       \u2502       \u2502          \u2502       \u2502
       \u2502       \u2502          \u2502       \u2502
       \u2502       \u2502          \u2502       \u2502
       \u2502       \u2502          \u2502       \u2502
       \u2502       \u2502          \u2502       \u2502
       \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518          \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518
</span></span></code></pre></div><p>Becomes:</p><div class="language-text ext-text"><pre class="shiki" style="background-color:#2e3440ff;"><code><span class="line"><span style="color:#d8dee9ff;">Fill--&gt;\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510   Draw--&gt;\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
Ptr    \u2502Buffer \u2502   Ptr    \u2502Buffer \u2502
       \u2502A      \u2502          \u2502B      \u2502
       \u2502       \u2502          \u2502       \u2502
       \u2502       \u2502          \u2502       \u2502
       \u2502       \u2502          \u2502       \u2502
       \u2502       \u2502          \u2502       \u2502
       \u2502       \u2502          \u2502       \u2502
       \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518          \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518
</span></span></code></pre></div><h4 id="buffer-size" tabindex="-1"><a class="header-anchor" href="#buffer-size" aria-hidden="true">#</a> Buffer Size</h4><p>The size of each buffer (indeed, any buffer) depends on two things:</p><ul><li>how many elements are needed</li><li>how much data is needed per element</li></ul><p>We know that the buffers exist to support the HBlank handler, so the number of elements in the buffer are however many times the HBlank can trigger. We said earlier that the HBlank starts at the end of every screen line, so the number of elements is at least that many. However, remember <em>when</em> the HBlank starts: at the <em>end</em> of every line. What do we do if we need to change the 0th line (before <em>any</em> line has started drawing)? Well, we need to change that value <em>before</em> line 0 starts, which means it has to be done in the VBlank. And <strong>that</strong> means we need one more element. In short, we need the height of the screen plus one (144+1=145) elements in each buffer.</p><p>This tutorial is only concerned with the scroll registers, so it only needs to store 2 values per line: one for <code>SCY</code> and one for <code>SCX</code>. (You can store more data per line, of course, but this tutorial doesn&#39;t require it.)</p><p>In summary: each buffer is 145 2-byte elements (290 bytes), and we need two of them, so the total buffer memory size is 580 bytes.</p><h4 id="location-in-memory" tabindex="-1"><a class="header-anchor" href="#location-in-memory" aria-hidden="true">#</a> Location in Memory</h4><p>Assume for a moment that you put the buffers physically next to each other in memory. For example, Buffer A is at <code>$C000</code> and Buffer B is at <code>$C122</code> (the buffer size is 290 bytes). We said earlier that in order to swap buffers, we just swap pointers, so the code that does that might look like this:</p><div class="language-asm ext-asm line-numbers-mode"><pre class="shiki" style="background-color:#2e3440ff;"><code><span class="line"><span style="color:#616E88;">; assume the pointers are next to each other in memory</span></span>
<span class="line"><span style="color:#88C0D0;">wDrawBuffer</span><span style="color:#ECEFF4;">:</span><span style="color:#D8DEE9FF;"> </span><span style="color:#81A1C1;">DS</span><span style="color:#D8DEE9FF;"> </span><span style="color:#B48EAD;">2</span><span style="color:#D8DEE9FF;"> </span><span style="color:#616E88;">; buffer currently being drawn</span></span>
<span class="line"><span style="color:#88C0D0;">wFillBuffer</span><span style="color:#ECEFF4;">:</span><span style="color:#D8DEE9FF;"> </span><span style="color:#81A1C1;">DS</span><span style="color:#D8DEE9FF;"> </span><span style="color:#B48EAD;">2</span><span style="color:#D8DEE9FF;"> </span><span style="color:#616E88;">; buffer currently being modified</span></span>
<span class="line"></span>
<span class="line"><span style="color:#616E88;">; swap the contents of each pointer (28 cycles)</span></span>
<span class="line"><span style="color:#D8DEE9FF;">ld  hl,wDrawBuffer</span></span>
<span class="line"><span style="color:#D8DEE9FF;">ld  a,[hl+]</span></span>
<span class="line"><span style="color:#D8DEE9FF;">ld  b,[hl]</span></span>
<span class="line"><span style="color:#D8DEE9FF;">ld  c,a     </span><span style="color:#616E88;">; bc = contents of wDrawBuffer</span></span>
<span class="line"><span style="color:#81A1C1;">inc</span><span style="color:#D8DEE9FF;"> hl</span></span>
<span class="line"><span style="color:#D8DEE9FF;">ld  a,[hl+] </span><span style="color:#616E88;">; a = LOW(contents of wFillBuffer)</span></span>
<span class="line"><span style="color:#D8DEE9FF;">ld  d,[hl]  </span><span style="color:#616E88;">; d = HIGH(contents of wFillBuffer)</span></span>
<span class="line"><span style="color:#D8DEE9FF;">ld  hl,wDrawBuffer</span></span>
<span class="line"><span style="color:#D8DEE9FF;">ld  [hl+],a</span></span>
<span class="line"><span style="color:#D8DEE9FF;">ld  [hl],d</span></span>
<span class="line"><span style="color:#81A1C1;">inc</span><span style="color:#D8DEE9FF;"> hl</span></span>
<span class="line"><span style="color:#D8DEE9FF;">ld  a,c</span></span>
<span class="line"><span style="color:#D8DEE9FF;">ld  [hl+],a</span></span>
<span class="line"><span style="color:#D8DEE9FF;">ld  [hl],b</span></span>
<span class="line"></span></code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br></div></div><p>To use a pointer, that code looks like this:</p><div class="language-asm ext-asm line-numbers-mode"><pre class="shiki" style="background-color:#2e3440ff;"><code><span class="line"><span style="color:#616E88;">; use a pointer (8 cycles)</span></span>
<span class="line"><span style="color:#D8DEE9FF;">ld  hl,wFillBuffer</span></span>
<span class="line"><span style="color:#D8DEE9FF;">ld  a,[hl+]</span></span>
<span class="line"><span style="color:#D8DEE9FF;">ld  h,[hl]</span></span>
<span class="line"><span style="color:#D8DEE9FF;">ld  l,a  </span><span style="color:#616E88;">; hl = contents of wFillBuffer ($C000 or $C122)</span></span>
<span class="line"></span></code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><p>You could certainly implement the system like this, but there is a way to gain some efficiency when swapping buffers and even with the actual pointers themselves.</p><p>Consider this: other than the memory locations, the buffers are identical. Since we&#39;re only really concerned with pointers, <em>where</em> the buffers reside in memory doesn&#39;t really matter. This can be exploited (and optimized!)</p><p>We can keep Buffer A at <code>$C000</code>. The buffer size is <code>$122</code> bytes, but instead of putting Buffer B at <code>$C122</code>, what if we put it at <code>$C200</code>? This would make the pointer values <code>$C000</code> and <code>$C200</code>. Literally a 1-bit difference. This, too, can be exploited! Both pointers end in <code>$00</code> so we don&#39;t need to store those, which saves 2 bytes. This leaves us with two 1-byte &#39;pointers&#39;: <code>$C0</code> and <code>$C2</code>.</p><p>To swap the pointers, literally just one bit has to be toggled:</p><div class="language-asm ext-asm line-numbers-mode"><pre class="shiki" style="background-color:#2e3440ff;"><code><span class="line"><span style="color:#616E88;">; swap the contents of each &#39;pointer&#39; (11 cycles)</span></span>
<span class="line"><span style="color:#D8DEE9FF;">ldh a,[hFillBuffer]</span></span>
<span class="line"><span style="color:#D8DEE9FF;">ldh [hDrawBuffer],a</span></span>
<span class="line"><span style="color:#81A1C1;">xor</span><span style="color:#D8DEE9FF;"> </span><span style="color:#B48EAD;">$02</span></span>
<span class="line"><span style="color:#D8DEE9FF;">ldh [hFillBuffer],a</span></span>
<span class="line"></span></code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><p>And to use a pointer, we only need to do this:</p><div class="language-asm ext-asm line-numbers-mode"><pre class="shiki" style="background-color:#2e3440ff;"><code><span class="line"><span style="color:#616E88;">; use a &#39;pointer&#39; (6 cycles)</span></span>
<span class="line"><span style="color:#D8DEE9FF;">ldh a,[hFillBuffer]</span></span>
<span class="line"><span style="color:#D8DEE9FF;">ld  h,a</span></span>
<span class="line"><span style="color:#D8DEE9FF;">ld  l,</span><span style="color:#B48EAD;">0</span><span style="color:#D8DEE9FF;">  </span><span style="color:#616E88;">; hl = contents of hFillBuffer ($C000 or $C200)</span></span>
<span class="line"></span></code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><p>You&#39;ll notice that the name of the pointers have changed. This is because they were moved into HRAM. (Also notice that they don&#39;t have to be next to each other in memory.) They were moved to HRAM for a couple of reasons: it allows an optimization in the swapping code (11 cycles vs 28), and it makes the use code slightly faster. There are only 2 bytes used now so that is a better candidate for moving to HRAM than 4 bytes.</p><h3 id="vblank" tabindex="-1"><a class="header-anchor" href="#vblank" aria-hidden="true">#</a> VBlank</h3><p>In this system, code in the VBlank is responsible for two things:</p><ul><li>swapping the pointers</li><li>setting the data for line 0</li></ul><p>We&#39;ve already seen what swapping the pointers looks like, but how is the data set for line 0? We need to emulate an HBlank handler running for &quot;line -1&quot; by getting the start of the new draw buffer and setting the scroll registers with the first data pair:</p><div class="language-asm ext-asm line-numbers-mode"><pre class="shiki" style="background-color:#2e3440ff;"><code><span class="line"><span style="color:#D8DEE9FF;">ldh a,[hDrawBuffer]</span></span>
<span class="line"><span style="color:#D8DEE9FF;">ld  h,a</span></span>
<span class="line"><span style="color:#D8DEE9FF;">ld  l,</span><span style="color:#B48EAD;">0</span></span>
<span class="line"></span>
<span class="line"><span style="color:#616E88;">; set the scroll registers</span></span>
<span class="line"><span style="color:#D8DEE9FF;">ld  a,[hl+]</span></span>
<span class="line"><span style="color:#D8DEE9FF;">ldh [rSCY],a</span></span>
<span class="line"><span style="color:#D8DEE9FF;">ld  a,[hl+]</span></span>
<span class="line"><span style="color:#D8DEE9FF;">ldh [rSCX],a</span></span>
<span class="line"></span></code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div><p>It&#39;s convenient that the scroll register addresses are next to each other. The data in the buffer is in the same order so as you can see in the code fragment above, this makes writing simple.</p><h3 id="hblank-handler" tabindex="-1"><a class="header-anchor" href="#hblank-handler" aria-hidden="true">#</a> HBlank Handler</h3><p>In an HBlank handler, <strong>every cycle counts</strong>! So don&#39;t do any work in there unless it&#39;s absolutely necessary. This is a good target for hyper-optimizations -- especially if you are changing VRAM (like palettes) -- so one should design around that optimization.</p><div class="language-asm ext-asm line-numbers-mode"><pre class="shiki" style="background-color:#2e3440ff;"><code><span class="line"><span style="color:#88C0D0;">HBlankHandler</span><span style="color:#ECEFF4;">:</span><span style="color:#D8DEE9FF;">:</span></span>
<span class="line"><span style="color:#D8DEE9FF;">  </span><span style="color:#81A1C1;">push</span><span style="color:#D8DEE9FF;">  af</span></span>
<span class="line"><span style="color:#D8DEE9FF;">  </span><span style="color:#81A1C1;">push</span><span style="color:#D8DEE9FF;">  hl</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D8DEE9FF;">  </span><span style="color:#616E88;">; obtain the pointer to the data pair</span></span>
<span class="line"><span style="color:#D8DEE9FF;">  ldh a,[rLY]</span></span>
<span class="line"><span style="color:#D8DEE9FF;">  </span><span style="color:#81A1C1;">inc</span><span style="color:#D8DEE9FF;"> a</span></span>
<span class="line"><span style="color:#D8DEE9FF;">  </span><span style="color:#81A1C1;">add</span><span style="color:#D8DEE9FF;"> a,a </span><span style="color:#616E88;">; double the offset since each line uses 2 bytes</span></span>
<span class="line"><span style="color:#D8DEE9FF;">  ld  l,a</span></span>
<span class="line"><span style="color:#D8DEE9FF;">  ldh a,[hDrawBuffer]</span></span>
<span class="line"><span style="color:#D8DEE9FF;">  </span><span style="color:#81A1C1;">adc</span><span style="color:#D8DEE9FF;"> </span><span style="color:#B48EAD;">0</span></span>
<span class="line"><span style="color:#D8DEE9FF;">  ld  h,a  </span><span style="color:#616E88;">; hl now points to somewhere in the draw buffer</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D8DEE9FF;">  </span><span style="color:#616E88;">; set the scroll registers</span></span>
<span class="line"><span style="color:#D8DEE9FF;">  ld  a,[hl+]</span></span>
<span class="line"><span style="color:#D8DEE9FF;">  ldh [rSCY],a</span></span>
<span class="line"><span style="color:#D8DEE9FF;">  ld  a,[hl+]</span></span>
<span class="line"><span style="color:#D8DEE9FF;">  ldh [rSCX],a</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D8DEE9FF;">  </span><span style="color:#81A1C1;">pop</span><span style="color:#D8DEE9FF;"> hl</span></span>
<span class="line"><span style="color:#D8DEE9FF;">  </span><span style="color:#81A1C1;">pop</span><span style="color:#D8DEE9FF;"> af</span></span>
<span class="line"><span style="color:#D8DEE9FF;">  reti</span></span>
<span class="line"></span></code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br></div></div><p>Notice that we can take advantage of the fact that there is only 2 bytes per line. We can use <code>LY</code> directly and quickly turn it into pointer. (Thanks to rondnelson99 for pointing this out!)</p><h3 id="use-the-fill-buffer" tabindex="-1"><a class="header-anchor" href="#use-the-fill-buffer" aria-hidden="true">#</a> Use the fill buffer</h3><p>And there you have it. An automatic and stable way to take advantage of the HBlank to do whatever your imagination wants to do!</p><p>All you need to do is set the fill buffer while the draw buffer is being displayed (you have an entire frame&#39;s worth of time to do this) and the system does the rest!</p><h2 id="effects" tabindex="-1"><a class="header-anchor" href="#effects" aria-hidden="true">#</a> Effects</h2><h3 id="x-horizontal-sine" tabindex="-1"><a class="header-anchor" href="#x-horizontal-sine" aria-hidden="true">#</a> X (Horizontal) Sine</h3><p>This effect uses a sine table to shift each line in a pleasant way. There are 3 states to this effect:</p><ul><li>The image is stable and a progression line moves up the screen starting each line on its way</li><li>The table cycles a few times</li><li>The image stability is restored with the progression line moving up the screen</li></ul><p>The values in the table can dramatically change the effect. For example, if the sine cycle was short enough, you could simulate a smoke effect (for example). Try it out!</p><p>Also, you could create a &#39;glitch&#39; effect during a cut-scene, perhaps in a sci-fi game to simulate a slightly dirty transmission.</p><p><img src="`+p+'" alt="X Sine"></p><h3 id="y-vertical-sine" tabindex="-1"><a class="header-anchor" href="#y-vertical-sine" aria-hidden="true">#</a> Y (Vertical) Sine</h3><p>This effect is structured very similar to X Sine, in that there is a table of sine values driven by 3 states. The only difference is that <code>SCY</code> is changed instead of <code>SCX</code>.</p><p>This is a really good way to simulate water reflections.</p><p><img src="'+h+'" alt="Y Sine"></p><h3 id="x-and-y-sine" tabindex="-1"><a class="header-anchor" href="#x-and-y-sine" aria-hidden="true">#</a> X and Y Sine</h3><p>This is simply a combination of the X Sine and Y Sine effects so you can see how different it looks compared to just the X or Y changing.</p><p>Instead of a full-screen image like this tutorial uses, imagine if you had a repeating image in VRAM (bigger than the screen) that looked like water ripples. This would move just like water!</p><p><img src="'+d+'" alt="XY Sine"></p><h3 id="smear-on" tabindex="-1"><a class="header-anchor" href="#smear-on" aria-hidden="true">#</a> Smear On</h3><p>This is like a flood fill effect used as an appearance transition. It&#39;s quite simple in that it repeats the lines to achieve the &#39;smear&#39; effect and is perhaps more interesting than a fade in.</p><p>The specific image used in the tutorial is light along the bottom so it looks better if the screen was already light before the effect starts. You would change this to suit your image.</p><p><img src="'+f+'" alt="Smear On"></p><h3 id="smear-off" tabindex="-1"><a class="header-anchor" href="#smear-off" aria-hidden="true">#</a> Smear Off</h3><p>This is a disappearance transition and the reverse of Smear On. Due to the specific image that was used (i.e. it is light along the bottom), it looks better in this tutorial to have the effect reveal a light screen instead of dark. Again, you would change this to suit your image.</p><p><img src="'+u+'" alt="Smear Off"></p><h3 id="roll-on" tabindex="-1"><a class="header-anchor" href="#roll-on" aria-hidden="true">#</a> Roll On</h3><p>This effect simulates an image unrolling onto the screen. This might be useful for fantasy RPGs to transition to a map screen or perhaps a message written on a scroll. The image unrolls over a dark screen because the top of the image is mostly dark so it looks better to keep it dark than the contrast of using a light screen.</p><p><img src="'+b+'" alt="Roll On"></p><h3 id="roll-off" tabindex="-1"><a class="header-anchor" href="#roll-off" aria-hidden="true">#</a> Roll Off</h3><p>This effect simulates an image rolling off screen. This might be useful for fantasy RPGs to transition away from a map or scroll screen. This reveals a dark screen because the first thing you see in the roll is dark (because that&#39;s what&#39;s in VRAM below the screen). Keeping it dark made the transition more seamless.</p><p><img src="'+m+'" alt="Roll Off"></p>',74),Y=e("The roll effects look complicated but the implementation is probably one of the simpler ones. The key to make this look good is the values in the table. The roll size is 32 pixels, but you can change this to whatever size you want, provided the table values support it. This "),R={href:"https://www.youtube.com/watch?v=j04TKI9WKfo",target:"_blank",rel:"noopener noreferrer"},V=e("SpecBas demo"),M=e(" was used as a reference to obtain those values."),H=s("h2",{id:"how-to-build",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#how-to-build","aria-hidden":"true"},"#"),e(" How to build")],-1),L=e("A GNU makefile is included. You will have to tailor it for your development environment but it builds cleanly with "),I={href:"https://github.com/gbdev/rgbds",target:"_blank",rel:"noopener noreferrer"},W=e("RGBDS"),O=e(" 0.4.2. The only dependency is "),P={href:"https://github.com/gbdev/hardware.inc",target:"_blank",rel:"noopener noreferrer"},q=s("code",null,"hardware.inc",-1),z=e(". All of the effects are shown "),X={href:"https://github.com/BlitterObjectBob/ScrollexY#effects",target:"_blank",rel:"noopener noreferrer"},j=e("here"),G=e(" so you don't have to build first to see them."),N=t('<h2 id="notes-about-the-code" tabindex="-1"><a class="header-anchor" href="#notes-about-the-code" aria-hidden="true">#</a> Notes about the code</h2><p>To reduce dependencies, everything is in one .asm file. It&#39;s structured in a logical way and there are comments where applicable.</p><p>The effects are called &quot;parts&quot; by the code and each part has an <code>Init</code> and <code>Process</code> routine. The sequence is controlled by a table of <code>Init</code> pointers and driven by the <code>ProcessPartTransition</code> routine. Each <code>Init</code> is responsible for setting up the data for the effect (part) and to set the <code>Process</code> function pointer via the <code>SetProcessFunc</code> macro. When the effect is done, the <code>Process</code> routine calls the <code>SetChangePartFlag</code> to tell the tutorial driver to move to the next part.</p><p>There are non-effect parts present to get the effect sequence looking good when the parts are played one after the other. These are &quot;delay&quot; parts of various flavors:</p><ul><li><code>ShowDelay</code>: this shows the screen normally for a few seconds</li><li><code>LightDelay</code>: this shows a light-colored blank screen for a few seconds</li><li><code>DarkDelay</code>: this shows a dark-colored blank screen for a few seconds</li></ul><p>The <code>Delay</code> parts share code because they&#39;re only present to make the ROM look nice, but the effects parts were developed in a way to be isolated from one another. This was done to make extraction easier. Because of this, you will see similar code present across several parts, for example, the various Sine effects.</p><p>One quirk you might notice when looking at VRAM is that the tile map is placed at 0,4 instead of 0,0. This was done to get the roll/unroll to handle the top of the screen correctly. The effects look best when they smoothly (dis)appear off-screen and if the image was placed at 0,0, the code to handle that would be distracting to how to implement the core of the effect.</p><p>Another topic worth mentioning is the row of light tiles that are under the image in VRAM. This was necessary to allow <code>LightDelay</code> to exist. Those light tiles don&#39;t <em>have</em> to be right under the image, that&#39;s just where it was placed for this tutorial. It could be moved well out of the way so it doesn&#39;t affect the effects that show that part of VRAM (Y Sine, Roll On, Roll Off).</p>',8),U=e("If you run the ROM in "),K={href:"https://bgb.bircd.org/",target:"_blank",rel:"noopener noreferrer"},J=e("BGB"),Q=e(" and have the Debug Messages window open, you will see the various parts announce themselves when they are initialized."),Z=s("h2",{id:"exercises-for-the-reader",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#exercises-for-the-reader","aria-hidden":"true"},"#"),e(" Exercises for the reader")],-1),ee=e("You can do more things than just change the scroll registers. For example, you can change the palette. Can you do this to make the roll/unroll effect look better? Here's an "),se={href:"https://www.youtube.com/watch?v=_-GTCao5cxs",target:"_blank",rel:"noopener noreferrer"},ne=e("example of scroll register and palette changes"),ae=e("."),te=e("This "),oe={href:"https://www.youtube.com/watch?v=leTk0uRnE_g&t=91s",target:"_blank",rel:"noopener noreferrer"},le=e("appearance effect"),re=e(" from Sword of Sodan (Amiga) is really cool! (And you might recognize one of the opening effects if you scrub to the beginning.)"),ie=e("Another raster effect you could do is a 'twist' like the one in the "),ce={href:"https://www.youtube.com/watch?v=WlMl8XKCb1Y&t=63s",target:"_blank",rel:"noopener noreferrer"},pe=e("Wired demo"),he=e("."),de=e("You can use this system to make a racing game similar to "),fe={href:"https://www.youtube.com/watch?v=yvbQD2pbJes",target:"_blank",rel:"noopener noreferrer"},ue=e("F-1 World Grand Prix II"),be=e(" or "),me={href:"https://www.youtube.com/watch?v=1kXiU_odMMM&t=110s",target:"_blank",rel:"noopener noreferrer"},ye=e("Wacky Races"),ge=e(". How might you achieve this?"),we=s("h2",{id:"prs-are-welcome",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#prs-are-welcome","aria-hidden":"true"},"#"),e(" PRs are welcome!")],-1),_e=s("p",null,"Other effects can be done, such as flipping the entire image about the X axis to look like its tumbling. What other effects can you create?",-1),Ee=s("h2",{id:"acknowledgements",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#acknowledgements","aria-hidden":"true"},"#"),e(" Acknowledgements")],-1),Fe=e("Thanks go to Ba\u015Dto for use of the "),De={href:"https://opengameart.org/content/dead-boy",target:"_blank",rel:"noopener noreferrer"},ve=e("Dead Boy"),ke=e(" image and "),xe={href:"https://github.com/ISSOtm",target:"_blank",rel:"noopener noreferrer"},Be=e("ISSOtm"),Te=e(" for peer review!"),$e=s("h2",{id:"license",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#license","aria-hidden":"true"},"#"),e(" License")],-1),Ae=e("This was released for educational purposes and so is placed in the Public Domain. See "),Ce={href:"https://github.com/gbdev/gbdev.github.io/blob/dev/list/.vuepress/public/deadcscroll/LICENSE",target:"_blank",rel:"noopener noreferrer"},Se=e("LICENSE"),Ye=e(" for more details.");function Re(Ve,Me){const n=o("ExternalLinkIcon");return l(),r(i,null,[g,w,_,E,s("p",null,[F,s("a",D,[v,a(n)]),k]),x,s("blockquote",null,[s("p",null,[B,s("em",null,[T,s("a",$,[A,a(n)]),C])])]),S,s("p",null,[Y,s("a",R,[V,a(n)]),M]),H,s("p",null,[L,s("a",I,[W,a(n)]),O,s("a",P,[q,a(n)]),z,s("a",X,[j,a(n)]),G]),N,s("p",null,[U,s("a",K,[J,a(n)]),Q]),Z,s("p",null,[ee,s("a",se,[ne,a(n)]),ae]),s("p",null,[te,s("a",oe,[le,a(n)]),re]),s("p",null,[ie,s("a",ce,[pe,a(n)]),he]),s("p",null,[de,s("a",fe,[ue,a(n)]),be,s("a",me,[ye,a(n)]),ge]),we,_e,Ee,s("p",null,[Fe,s("a",De,[ve,a(n)]),ke,s("a",xe,[Be,a(n)]),Te]),$e,s("p",null,[Ae,s("a",Ce,[Se,a(n)]),Ye])],64)}var Ie=c(y,[["render",Re]]);export{Ie as default};
