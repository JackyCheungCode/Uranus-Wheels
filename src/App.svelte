<script lang="ts">
  import { Brand, MStripe } from '@emdzej/bimmerz-ui';
  let mobileMenuOpen = $state(false);
</script>

<svelte:head>
  <title>Uranus Wheels — Precision Forged</title>
  <meta name="description" content="Precision-forged wheels, engineered around your BMW." />
</svelte:head>

<div class="site-shell">
  <MStripe class="uw-m-stripe" />
  <header class="site-header">
    <a class="brand" href="/" aria-label="Uranus Wheels home"><Brand body="URANUS" suffix="WHEELS" /></a>
    <button class="menu-toggle" aria-expanded={mobileMenuOpen} aria-label="Toggle navigation" onclick={() => mobileMenuOpen = !mobileMenuOpen}>☰</button>
    <nav class:open={mobileMenuOpen} aria-label="Main navigation">
      <a href="#wheels">FORGED WHEELS</a>
      <a href="/fitment-finder">BMW FITMENT</a>
      <a href="#engineering">ENGINEERING</a>
      <a href="#contact">CONTACT</a>
    </nav>
    <a class="header-cta" href="/fitment-finder">FIND YOUR WHEELS <span>↗</span></a>
  </header>

  <main>
    <section class="hero">
      <div class="hero-image" role="img" aria-label="Dark performance coupe on a mountain road"></div>
      <div class="hero-content">
        <p class="eyebrow">BMW-FOCUSED FORGED WHEELS</p>
        <h1>PRECISION<br />FORGED.</h1>
        <p class="hero-copy">Engineered for the machine.<br />Made for the driver.</p>
        <div class="hero-actions">
          <a class="button button-light" href="/fitment-finder">FIND WHEELS FOR YOUR BMW <span>↗</span></a>
          <a class="text-link" href="#wheels">EXPLORE THE COLLECTION</a>
        </div>
      </div>
      <div class="hero-index"><span>01</span> / FORGED PERFORMANCE</div>
    </section>

    <section class="intro section-pad" id="wheels">
      <div><p class="eyebrow">THE URANUS STANDARD</p><h2>Built around<br />your ambition.</h2></div>
      <p class="intro-copy">Purposeful design. Precision fitment. Forged construction. Explore wheel designs created for BMW platforms and the people who drive them.</p>
    </section>
    <section class="feature-band" id="engineering">
      <div class="feature-image"></div>
      <div class="feature-copy"><p class="eyebrow">ENGINEERED TO FIT</p><h2>Form follows<br />function.</h2><p>Every build begins with the vehicle. Find your BMW, review the fitment data, and explore a wheel setup tailored to your specification.</p><a class="text-link" href="/fitment-finder">START WITH YOUR BMW <span>↗</span></a></div>
    </section>
  </main>
  <footer id="contact"><a class="brand" href="/"><Brand body="URANUS" suffix="WHEELS" /></a><span>PRECISION FORGED. BMW-FOCUSED.</span><span>© {new Date().getFullYear()} URANUS WHEELS</span></footer>
</div>
