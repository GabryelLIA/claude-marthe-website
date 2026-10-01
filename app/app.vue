<template>
  <div class="site">
    <SiteHeader />
    <main>
      <NuxtPage />
    </main>
    <SiteFooter />
  </div>
</template>

<style scoped>
.site {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;

  main {
    flex: 1;
  }
}
</style>
