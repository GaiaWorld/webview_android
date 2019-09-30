struct OK_I{
    value: usize,
}

struct OK_S{
    value: String,
}

struct Req{
    path: String,
}

struct Error{
    code: usize,
    info: String,
}

struct Ok{}