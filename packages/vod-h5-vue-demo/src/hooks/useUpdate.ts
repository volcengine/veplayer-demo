/**
 * Copyright 2024 (c) Beijing Volcano Engine Technology Co., Ltd.
 * SPDX-License-Identifier: MIT
 */

import { ref } from 'vue';

// Vue中实现React的useUpdate效果
export function useUpdate() {
  const updateRef = ref(0);

  const update = () => {
    updateRef.value += 1;
  };

  return update;
}
