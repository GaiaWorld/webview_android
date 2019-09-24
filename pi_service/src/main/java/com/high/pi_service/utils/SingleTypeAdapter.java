package com.high.pi_service.utils;

public abstract class SingleTypeAdapter implements TypeAdapter {

    private int typeToAdapt;

    /**
     * Create a SingleTypeAdapter
     *
     * @param typeToAdapt The V8 Type this TypeAdapter should be applied to.
     */
    public SingleTypeAdapter(final int typeToAdapt) {
        this.typeToAdapt = typeToAdapt;
    }

    @Override
    public Object adapt(final int type, final Object value) {
        if (type == typeToAdapt) {
            return adapt(value);
        }
        return DEFAULT;
    }


    public abstract Object adapt(final Object value);

}
