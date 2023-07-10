<!-- v1.0 -->

<script lang="ts">
export default {
  name: 'AffixSpan'
}
</script>

<template>
  <div class="affix-span">
    <slot name="prefix">
      <div v-if="props.prefix" class="affix prefix">
        {{ props.prefix }}
      </div>
    </slot>
    
    <slot>
      <div class="span">
        {{ props.content }}
      </div>
    </slot>

    <slot name="suffix">
      <div v-if="props.suffix" class="affix suffix">
        {{ props.suffix }}
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    prefix: {
      type: String
    },
    suffix: {
      type: String
    },
    content: {
      type: String
    },
    affixBgc: {
      type: String,
      default: '#00000005'
    }
  })
</script>


<style scoped>
*{
  box-sizing: border-box;
}
.affix-span{
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  line-height: normal;
  border: 1px solid #d9d9d9;
  border-radius: 5px;
}
.affix{
  padding: 0.4em 0.8em;
  background: v-bind(affixBgc);
}
.prefix{
  border-right: 1px solid #d9d9d9;
}
.suffix{
  border-left: 1px solid #d9d9d9;
}
.span{
  padding: 0.4em 0.8em;
  flex: 1;
  width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>