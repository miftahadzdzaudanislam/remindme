<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tugas extends Model
{
    use HasFactory;

    protected $table = "tugas";
    protected $fillable = ['user_id', 'mata_kuliah_id', 'judul', 'deskripsi', 'deadline', 'prioritas', 'is_done'];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function mata_kuliah() {
        return $this->belongsTo(MataKuliah::class);
    }
}
