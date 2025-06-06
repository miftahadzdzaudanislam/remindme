<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MataKuliah extends Model
{
    use HasFactory;
    protected $table = "mata_kuliahs";

    protected $fillable = ['user_id', 'nama_matkul', 'nama_dosen', 'hari', 'jam', 'ruangan', 'sync_google', 'google_event_id'];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function tugas() {
        return $this->hasMany(Tugas::class)->with('mata_kuliah_id');
    }
}
