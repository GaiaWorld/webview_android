#[path=./]
use util::{u64Merge, u128Merge, u64Unwrap, u128Unwrap};

#[constructor=true]
struct U64 {
    value: u64
}

#[constructor=true]
struct U128 {
    value: u128
}