package com.kuplay.pi_framework.Util

object ContainerUtil {
    /**
     * Determine whether the list is null or empty.
     *
     * @param list list
     * @return 1、true:is null or is empty. 2、not null and not empty.
     */
    fun isNullOrEmpty(list: List<*>?): Boolean {
        return null == list || 0 == list.size
    }

    /**
     * Determine whether the set is null or empty.
     *
     * @param set set
     * @return 1、true:is null or is empty. 2、not null and not empty.
     */
    fun isNullOrEmpty(set: Set<*>?): Boolean {
        return null == set || 0 == set.size
    }

}